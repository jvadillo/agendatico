import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, Calendar, Eye, Heart, Pencil } from 'lucide-react';
import MobileLayout from '@/layouts/mobile-layout';
import { useTranslation } from '@/hooks/use-translation';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';

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
    views_count: number;
    favorites_count: number;
    image_url: string | null;
    deleted_at: string | null;
    category: Category;
    town: Town;
}

interface PaginatedEvents {
    data: Event[];
    current_page: number;
    last_page: number;
}

interface Props {
    events: PaginatedEvents;
}

export default function MyEvents({ events }: Props) {
    const { t, locale } = useTranslation();
    const dateLocale = locale === 'es' ? es : enUS;

    return (
        <MobileLayout>
            <Head title={t('auth.my_events')} />

            {/* Header - mobile only */}
            <header className="sticky top-0 z-40 bg-background border-b border-border md:hidden">
                <div className="flex items-center gap-3 p-4">
                    <Link href="/settings/profile" className="icon-btn">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="font-semibold">{t('auth.my_events')}</h1>
                </div>
            </header>

            {/* Content */}
            <main className="p-4 md:px-6">
                {/* Desktop title */}
                <h1 className="hidden md:block text-2xl font-bold mb-6">{t('auth.my_events')}</h1>
                
                {events.data.length > 0 ? (
                    <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
                        {events.data.map((event) => (
                            <Link
                                key={event.id}
                                href={`/events/${event.slug}`}
                                className={cn(
                                    'event-card horizontal md:flex-col md:p-0',
                                    event.deleted_at && 'opacity-50'
                                )}
                            >
                                <div className="card-image md:w-full md:h-48 md:rounded-none md:rounded-t-xl">
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
                                </div>
                                <div className="card-content md:p-4">
                                    <h3>{event.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>
                                            {format(new Date(event.starts_at), 'd MMM yyyy', { locale: dateLocale })}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {event.views_count}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Heart className="w-3 h-3" />
                                                {event.favorites_count}
                                            </span>
                                        </div>
                                        {!event.deleted_at && (
                                            <Link
                                                href={`/events/${event.slug}/edit`}
                                                className="flex items-center gap-1 text-primary"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Pencil className="w-3 h-3" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>{t('home.no_events')}</p>
                    </div>
                )}
            </main>
        </MobileLayout>
    );
}
