import { usePage, router } from '@inertiajs/react';
import { useCallback, useMemo } from 'react';

type TranslationValue = string | Record<string, unknown>;
type Translations = Record<string, TranslationValue>;

interface PageProps {
    locale: string;
    translations: Translations;
    [key: string]: unknown;
}

/**
 * Hook for accessing translations in React components
 * Usage: const { t, locale, setLocale } = useTranslation();
 * t('nav.home') => "Inicio" or "Home"
 */
export function useTranslation() {
    const { locale, translations } = usePage<PageProps>().props;

    const t = useCallback(
        (key: string, replacements: Record<string, string> = {}): string => {
            const keys = key.split('.');
            let value: TranslationValue | undefined = translations;

            for (const k of keys) {
                if (value && typeof value === 'object' && k in value) {
                    value = (value as Record<string, TranslationValue>)[k];
                } else {
                    // Key not found, return the key itself
                    return key;
                }
            }

            if (typeof value !== 'string') {
                return key;
            }

            // Handle replacements like :name
            let result = value;
            Object.entries(replacements).forEach(([placeholder, replacement]) => {
                result = result.replace(new RegExp(`:${placeholder}`, 'g'), replacement);
            });

            return result;
        },
        [translations]
    );

    const setLocale = useCallback((newLocale: string) => {
        fetch('/locale', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify({ locale: newLocale }),
        }).then(() => {
            router.reload();
        });
    }, []);

    return useMemo(() => ({ t, locale, setLocale }), [t, locale, setLocale]);
}

export default useTranslation;
