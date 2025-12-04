import { Link } from '@inertiajs/react';
import { Heart, MapPin, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from '@/hooks/use-translation';

interface Category {
    id: number;
    name: string;
    slug: string;
    color: string;
}

interface Town {
    id: number;
    name: string;
    slug: string;
}

interface Event {
    id: number;
    title: string;
    slug: string;
    description: string;
    starts_at: string;
    price_type: 'free' | 'donation' | 'paid';
    price_amount: string | null;
    image_path: string | null;
    image_url: string | null;
    category: Category;
    town: Town;
    is_favorited?: boolean;
}

interface EventCardProps {
    event: Event;
    onFavoriteToggle?: (eventId: number) => void;
    horizontal?: boolean;
}

export function EventCard({ event, onFavoriteToggle, horizontal = true }: EventCardProps) {
    const { locale, t } = useTranslation();
    const dateLocale = locale === 'es' ? es : enUS;
    
    const formattedDate = format(new Date(event.starts_at), 'd MMM', { locale: dateLocale });
    const formattedTime = format(new Date(event.starts_at), 'HH:mm');

    const priceDisplay = event.price_type === 'free' 
        ? t('filters.free')
        : event.price_type === 'donation' 
            ? t('filters.donation')
            : event.price_amount || t('filters.paid');

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onFavoriteToggle?.(event.id);
    };

    return (
        <Link href={`/events/${event.slug}`} className={cn('event-card block', horizontal && 'horizontal')}>
            <div className="card-image">
                {event.image_url ? (
                    <img src={event.image_url} alt={event.title} loading="lazy" />
                ) : (
                    <div 
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: event.category.color + '20' }}
                    >
                        <span className="text-2xl" style={{ color: event.category.color }}>
                            📅
                        </span>
                    </div>
                )}
            </div>
            <div className="card-content">
                <h3>{event.title}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                    <span 
                        className="category-badge"
                        style={{ 
                            backgroundColor: event.category.color + '20',
                            color: event.category.color 
                        }}
                    >
                        {event.category.name}
                    </span>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formattedDate} • {formattedTime}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.town.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{priceDisplay}</span>
                        <button
                            onClick={handleFavoriteClick}
                            className="p-1 -m-1 hover:scale-110 transition-transform"
                        >
                            <Heart 
                                className={cn(
                                    'w-4 h-4 transition-colors',
                                    event.is_favorited 
                                        ? 'fill-red-500 text-red-500' 
                                        : 'text-muted-foreground'
                                )} 
                            />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
