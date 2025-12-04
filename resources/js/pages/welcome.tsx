import { Head, Link } from '@inertiajs/react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';

// Sample images for the mosaic - these would be actual event images
const mosaicImages = [
    { src: '/images/splash/concert.jpg', alt: 'Concert', style: 'row-span-2' },
    { src: '/images/splash/fire.jpg', alt: 'Fire show' },
    { src: '/images/splash/crowd.jpg', alt: 'Crowd', style: 'col-span-1 row-span-2' },
    { src: '/images/splash/yoga.jpg', alt: 'Yoga' },
    { src: '/images/splash/beach.jpg', alt: 'Beach party' },
    { src: '/images/splash/drums.jpg', alt: 'Drums' },
    { src: '/images/splash/sunset.jpg', alt: 'Sunset' },
    { src: '/images/splash/dance.jpg', alt: 'Dance' },
];

// Fallback gradient backgrounds for images that don't exist
const gradients = [
    'from-orange-500 to-red-600',
    'from-purple-500 to-pink-600',
    'from-blue-500 to-purple-600',
    'from-cyan-500 to-blue-600',
    'from-green-500 to-teal-600',
    'from-yellow-500 to-orange-600',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-purple-600',
];

export default function Welcome() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
            <Head title={t('app.name')} />

            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center gap-2">
                <span className="text-2xl font-bold text-white">A</span>
                <span className="text-sm text-white/80">{t('welcome.title')}</span>
            </header>

            {/* Image Mosaic Background */}
            <div className="flex-1 relative">
                <div className="absolute inset-0 grid grid-cols-3 gap-2 p-2 pt-16">
                    {mosaicImages.map((img, index) => (
                        <div
                            key={index}
                            className={`relative rounded-2xl overflow-hidden ${img.style || ''}`}
                        >
                            {/* Gradient fallback */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} opacity-80`} />
                            
                            {/* Image overlay effect */}
                            <div className="absolute inset-0 bg-black/20" />
                        </div>
                    ))}
                </div>

                {/* Gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-black via-black/80 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 z-10">
                <h1 className="text-4xl font-bold text-white mb-2">
                    {t('welcome.headline')}
                    <br />
                    <span className="text-primary">{t('welcome.headline_highlight')}</span>
                </h1>

                <Link href="/events" className="block mt-8">
                    <Button className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90">
                        {t('welcome.get_started')}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
