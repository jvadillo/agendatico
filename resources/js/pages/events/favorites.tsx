import { Head, Link } from '@inertiajs/react';
import { Heart, MapPin, Calendar, ChevronLeft } from 'lucide-react';
import MobileLayout from '@/layouts/mobile-layout';
import { useTranslation } from '@/hooks/use-translation';
import { useFavorites } from '@/hooks/use-favorites';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface Category {
    id: number;
    name: string;
    slug: string;
    color: string;
}

interface Town {
    id: number;
    name: string;
}

interface Event {
    id: number;
    title: string;
    slug: string;
    starts_at: string;
    image_url: string | null;
    category: Category;
    town: Town;
}

interface Props {
    events: Event[];
}

export default function Favorites({ events }: Props) {
    const { t, locale } = useTranslation();
    const dateLocale = locale === 'es' ? es : enUS;
    const { isFavorited, toggleFavorite } = useFavorites();

    // Filter events that are still favorites (in case of local changes)
    const favoriteEvents = events.filter(event => isFavorited(event.id));

    return (
        <MobileLayout>
            <Head title={t('nav.favorites')} />

            {/* Header */}
            <header className="sticky top-0 z-40 bg-background border-b border-border md:hidden">
                <div className="flex items-center gap-3 p-4">
                    <Link href="/" className="icon-btn">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="font-semibold">{t('nav.favorites')}</h1>
                </div>
            </header>

            {/* Content */}
            <main className="p-4 md:px-6 safe-bottom">
                {/* Desktop title */}
                <h1 className="hidden md:block text-2xl font-bold mb-6">{t('nav.favorites')}</h1>
                
                {favoriteEvents.length > 0 ? (
                    <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
                        {favoriteEvents.map((event) => (
                            <div key={event.id} className="event-card horizontal md:flex-col md:p-0">
                                <Link href={`/events/${event.slug}`} className="card-image md:w-full md:h-48 md:rounded-none md:rounded-t-xl">
                                    {event.image_url ? (
                                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div
                                            className="w-full h-full flex items-center justify-center"
                                            style={{ backgroundColor: event.category.color + '20' }}
                                        >
                                            <span className="text-2xl md:text-4xl">📅</span>
                                        </div>
                                    )}
                                </Link>
                                <div className="card-content flex-1 md:p-4">
                                    <Link href={`/events/${event.slug}`}>
                                        <h3>{event.title}</h3>
                                    </Link>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>
                                            {format(new Date(event.starts_at), 'd MMM yyyy', { locale: dateLocale })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                        <MapPin className="w-3 h-3" />
                                        <span>{event.town.name}</span>
                                    </div>
                                    <div className="md:flex md:justify-end md:mt-3">
                                        <button
                                            type="button"
                                            onClick={() => toggleFavorite(event.id)}
                                            className="favorite-btn active shrink-0 hidden md:flex"
                                            aria-label={t('events.remove_favorite')}
                                        >
                                            <Heart className="w-5 h-5 fill-current text-red-500" />
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => toggleFavorite(event.id)}
                                    className="favorite-btn active shrink-0 md:hidden"
                                    aria-label={t('events.remove_favorite')}
                                >
                                    <Heart className="w-5 h-5 fill-current" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>{t('events.no_favorites')}</p>
                        <Link href="/" className="btn btn-primary mt-4 inline-block">
                            {t('events.explore')}
                        </Link>
                    </div>
                )}
            </main>
        </MobileLayout>
    );
}
