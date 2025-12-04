/**
 * Client-side image resizing utility
 * Resizes images before upload to save bandwidth
 */

interface ResizeOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    type?: 'image/jpeg' | 'image/png' | 'image/webp';
}

const defaultOptions: ResizeOptions = {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.85,
    type: 'image/jpeg',
};

/**
 * Resize an image file before upload
 */
export async function resizeImage(
    file: File,
    options: ResizeOptions = {}
): Promise<File> {
    const opts = { ...defaultOptions, ...options };

    return new Promise((resolve, reject) => {
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            reject(new Error('File is not an image'));
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                // Calculate new dimensions maintaining aspect ratio
                let { width, height } = img;
                const maxWidth = opts.maxWidth!;
                const maxHeight = opts.maxHeight!;

                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                // Set canvas dimensions
                canvas.width = width;
                canvas.height = height;

                // Draw image on canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to blob
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Could not create blob'));
                            return;
                        }

                        // Create new file with same name
                        const resizedFile = new File(
                            [blob],
                            file.name.replace(/\.[^.]+$/, '.jpg'),
                            { type: opts.type }
                        );

                        resolve(resizedFile);
                    },
                    opts.type,
                    opts.quality
                );
            };

            img.onerror = () => {
                reject(new Error('Could not load image'));
            };

            img.src = event.target?.result as string;
        };

        reader.onerror = () => {
            reject(new Error('Could not read file'));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Create a preview URL for an image file
 */
export function createImagePreview(file: File): string {
    return URL.createObjectURL(file);
}

/**
 * Revoke a preview URL to free memory
 */
export function revokeImagePreview(url: string): void {
    URL.revokeObjectURL(url);
}

/**
 * Get image dimensions from a file
 */
export async function getImageDimensions(
    file: File
): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = createImagePreview(file);

        img.onload = () => {
            revokeImagePreview(url);
            resolve({ width: img.width, height: img.height });
        };

        img.onerror = () => {
            revokeImagePreview(url);
            reject(new Error('Could not load image'));
        };

        img.src = url;
    });
}
