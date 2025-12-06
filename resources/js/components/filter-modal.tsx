import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { useModal } from '@/contexts/modal-context';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    onApply?: () => void;
    onClear?: () => void;
}

export function FilterModal({ isOpen, onClose, title, children, onApply, onClear }: FilterModalProps) {
    const { t } = useTranslation();
    const { setModalOpen } = useModal();

    // Notify the layout when modal opens/closes
    useEffect(() => {
        setModalOpen(isOpen);
        return () => setModalOpen(false);
    }, [isOpen, setModalOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div 
                className="absolute bottom-0 left-0 right-0 max-w-md mx-auto bg-background rounded-t-2xl flex flex-col animate-in slide-in-from-bottom duration-300"
                style={{ maxHeight: '80dvh' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button 
                        onClick={onClose}
                        className="icon-btn"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 min-h-0">
                    {children}
                </div>

                {/* Footer */}
                {(onApply || onClear) && (
                    <div 
                        className="flex gap-3 p-4 border-t border-border shrink-0 bg-background"
                        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
                    >
                        {onClear && (
                            <Button variant="outline" onClick={onClear} className="flex-1">
                                {t('filters.clear')}
                            </Button>
                        )}
                        {onApply && (
                            <Button onClick={onApply} className="flex-1">
                                {t('filters.show_results')}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

interface FilterSectionProps {
    title: string;
    children: ReactNode;
}

export function FilterSection({ title, children }: FilterSectionProps) {
    return (
        <div className="mb-6">
            <h3 className="font-medium mb-3">{title}</h3>
            {children}
        </div>
    );
}

interface RadioOptionProps {
    name: string;
    value: string;
    checked: boolean;
    onChange: (value: string) => void;
    children: ReactNode;
}

export function RadioOption({ name, value, checked, onChange, children }: RadioOptionProps) {
    return (
        <label className="flex items-center gap-3 py-2 cursor-pointer">
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={() => onChange(value)}
                className="w-4 h-4 text-primary border-border focus:ring-primary"
            />
            <span className={cn(checked && 'font-medium')}>{children}</span>
        </label>
    );
}
