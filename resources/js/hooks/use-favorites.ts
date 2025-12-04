import { useState, useEffect, useCallback } from 'react';
import { usePage } from '@inertiajs/react';

const STORAGE_KEY = 'agendatico_favorites';

interface PageProps {
    auth: {
        user: {
            id: number;
        } | null;
    };
    [key: string]: unknown;
}

/**
 * Hybrid favorites hook - uses localStorage for guests, syncs to API for logged-in users
 */
export function useFavorites() {
    const { auth } = usePage<PageProps>().props;
    const [favorites, setFavorites] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load favorites on mount
    useEffect(() => {
        if (auth.user) {
            // Load from API for authenticated users
            loadFromApi();
        } else {
            // Load from localStorage for guests
            loadFromStorage();
        }
    }, [auth.user]);

    // Sync localStorage favorites to API when user logs in
    useEffect(() => {
        if (auth.user) {
            syncLocalToApi();
        }
    }, [auth.user]);

    const loadFromStorage = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setFavorites(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading favorites from storage:', error);
        }
    };

    const saveToStorage = (ids: number[]) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
        } catch (error) {
            console.error('Error saving favorites to storage:', error);
        }
    };

    const loadFromApi = async () => {
        try {
            const response = await fetch('/api/favorites');
            const data = await response.json();
            setFavorites(data.favorites || []);
        } catch (error) {
            console.error('Error loading favorites from API:', error);
        }
    };

    const syncLocalToApi = async () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return;

            const localFavorites = JSON.parse(stored);
            if (localFavorites.length === 0) return;

            const response = await fetch('/api/favorites/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'include',
                body: JSON.stringify({ event_ids: localFavorites }),
            });

            if (response.ok) {
                const data = await response.json();
                setFavorites(data.favorites || []);
                // Clear localStorage after successful sync
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch (error) {
            console.error('Error syncing favorites to API:', error);
        }
    };

    const toggleFavorite = useCallback(async (eventId: number) => {
        if (isLoading) return;

        const isFavorited = favorites.includes(eventId);
        const newFavorites = isFavorited
            ? favorites.filter(id => id !== eventId)
            : [...favorites, eventId];

        // Optimistic update
        setFavorites(newFavorites);

        if (auth.user) {
            // Update via API for authenticated users
            setIsLoading(true);
            try {
                const response = await fetch(`/api/events/${eventId}/favorite`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-XSRF-TOKEN': getCsrfToken(),
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    // Revert on error
                    setFavorites(favorites);
                }
            } catch (error) {
                console.error('Error toggling favorite:', error);
                setFavorites(favorites);
            } finally {
                setIsLoading(false);
            }
        } else {
            // Save to localStorage for guests
            saveToStorage(newFavorites);
        }
    }, [favorites, auth.user, isLoading]);

    const isFavorited = useCallback((eventId: number) => {
        return favorites.includes(eventId);
    }, [favorites]);

    return {
        favorites,
        toggleFavorite,
        isFavorited,
        isLoading,
    };
}

function getCsrfToken(): string {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'XSRF-TOKEN') {
            return decodeURIComponent(value);
        }
    }
    return '';
}
