import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, Heart, Clock, MapPin, ExternalLink, Instagram, MessageCircle, Globe, Pencil, Trash2, Eye, Share2 } from 'lucide-react';
import MobileLayout from '@/layouts/mobile-layout';
import { useTranslation } from '@/hooks/use-translation';
import { useFavorites } from '@/hooks/use-favorites';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
    slug: string;
}

interface Place {
    id: number;
    name: string;
    address: string | null;
}

interface User {
    id: number;
    name: string;
}

interface Event {
    id: number;
    title: string;
    slug: string;
    description: string;
    starts_at: string;
    ends_at: string | null;
    price_type: 'free' | 'donation' | 'paid';
    price_amount: string | null;
    image_path: string | null;
    image_url: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    organizer_name: string | null;
    instagram_url: string | null;
    whatsapp_url: string | null;
    website_url: string | null;
    views_count: number;
    favorites_count: number;
    maps_url: string | null;
    category: Category;
    town: Town;
    place: Place | null;
    user: User;
    is_favorited: boolean;
    is_owner: boolean;
}

interface Props {
    event: Event;
}

export default function EventShow({ event }: Props) {
    const { t, locale } = useTranslation();
    const { toggleFavorite, isFavorited } = useFavorites();
    const dateLocale = locale === 'es' ? es : enUS;

    const startDate = new Date(event.starts_at);
    const endDate = event.ends_at ? new Date(event.ends_at) : null;
    const formattedDate = format(startDate, "d MMMM yyyy, EEEE", { locale: dateLocale });
    const formattedTime = format(startDate, 'HH:mm');
    
    // Check if end date is on a different day
    const isSameDay = endDate && 
        startDate.getFullYear() === endDate.getFullYear() &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getDate() === endDate.getDate();
    
    const endTimeDisplay = endDate 
        ? (isSameDay 
            ? format(endDate, 'HH:mm')
            : format(endDate, "d MMM, HH:mm", { locale: dateLocale }))
        : null;

    const priceDisplay = event.price_type === 'free'
        ? t('events.free')
        : event.price_type === 'donation'
            ? t('events.donation')
            : event.price_amount || t('filters.paid');

    const favorited = isFavorited(event.id);

    const handleShare = async () => {
        const shareUrl = window.location.href;
        const shareData = {
            title: event.title,
            text: `${event.title} - ${formattedDate}`,
            url: shareUrl,
        };

        // Check if Web Share API is available AND can share this data
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                return;
            } catch (err) {
                // User cancelled or error - fall through to clipboard
            }
        }
        
        // Fallback: copy to clipboard
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert(t('events.link_copied'));
        } catch (err) {
            // Final fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert(t('events.link_copied'));
        }
    };

    const handleDelete = () => {
        if (confirm(t('publish.delete_confirm'))) {
            router.delete(`/events/${event.slug}`);
        }
    };

    const formatSocialUrl = (url: string | null, type: 'instagram' | 'whatsapp' | 'website'): string | null => {
        if (!url) return null;
        
        if (type === 'instagram') {
            if (url.startsWith('http')) return url;
            const username = url.replace('@', '');
            return `https://instagram.com/${username}`;
        }
        
        if (type === 'whatsapp') {
            if (url.startsWith('http')) return url;
            const phone = url.replace(/[^0-9]/g, '');
            return `https://wa.me/${phone}`;
        }
        
        return url;
    };

    return (
        <MobileLayout>
            <Head title={event.title} />

            {/* Header Image */}
            <div className="relative">
                <div className="aspect-[4/3] bg-secondary">
                    {event.image_url ? (
                        <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: event.category.color + '30' }}
                        >
                            <span className="text-6xl">📅</span>
                        </div>
                    )}
                </div>

                {/* Navigation overlay */}
                <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
                    <Link href="/" className="icon-btn-overlay">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleShare}
                            className="icon-btn-overlay"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => toggleFavorite(event.id)}
                            className="icon-btn-overlay"
                        >
                            <Heart className={cn('w-5 h-5', favorited && 'fill-current text-red-500')} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 pb-24">
                {/* Title & Price */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <h1 className="text-xl font-bold">{event.title}</h1>
                    <span
                        className="px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap"
                        style={{
                            backgroundColor: event.category.color + '20',
                            color: event.category.color,
                        }}
                    >
                        {priceDisplay}
                    </span>
                </div>

                {/* Date & Time */}
                <div className="info-card mb-3">
                    <div className="icon-box purple">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div className="info-text">
                        <span className="primary-text capitalize">{formattedDate}</span>
                        <span className="secondary-text">
                            {t('events.from')} {formattedTime}
                            {endTimeDisplay && ` ${t('events.to')} ${endTimeDisplay}`}
                        </span>
                    </div>
                </div>

                {/* Location */}
                <a
                    href={event.maps_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn('info-card mb-4', event.maps_url && 'cursor-pointer hover:bg-secondary/70')}
                >
                    <div className="icon-box purple">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div className="info-text flex-1">
                        <span className="primary-text">
                            {event.place?.name || event.town.name}
                        </span>
                        <span className="secondary-text">
                            {event.address || event.place?.address || event.town.name}
                        </span>
                    </div>
                    {event.maps_url && (
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    )}
                </a>

                {/* Tags */}
                <div className="scroll-container mb-6">
                    <span
                        className="tag-badge"
                        style={{
                            backgroundColor: event.category.color + '20',
                            color: event.category.color,
                        }}
                    >
                        {event.category.name}
                    </span>
                    <span className="tag-badge">{event.town.name}</span>
                    {event.price_type === 'free' && (
                        <span className="tag-badge bg-green-100 text-green-700">{t('events.free')}</span>
                    )}
                </div>

                {/* About */}
                <section className="mb-6">
                    <h3 className="font-semibold mb-2">{t('events.about')}</h3>
                    <div className="text-muted-foreground whitespace-pre-line">
                        {event.description}
                    </div>
                </section>

                {/* Organizer */}
                {event.organizer_name && (
                    <section className="mb-6">
                        <h3 className="font-semibold mb-2">{t('events.organizer')}</h3>
                        <p className="text-muted-foreground">{event.organizer_name}</p>
                    </section>
                )}

                {/* Contact Links */}
                {(event.instagram_url || event.whatsapp_url || event.website_url) && (
                    <section className="mb-6">
                        <h3 className="font-semibold mb-3">{t('events.contact')}</h3>
                        <div className="flex flex-wrap gap-2">
                            {event.instagram_url && (
                                <a
                                    href={formatSocialUrl(event.instagram_url, 'instagram')!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-btn-small instagram"
                                >
                                    <Instagram className="w-4 h-4" />
                                    Instagram
                                </a>
                            )}
                            {event.whatsapp_url && (
                                <a
                                    href={formatSocialUrl(event.whatsapp_url, 'whatsapp')!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-btn-small whatsapp"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    WhatsApp
                                </a>
                            )}
                            {event.website_url && (
                                <a
                                    href={event.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-btn-small website"
                                >
                                    <Globe className="w-4 h-4" />
                                    Web
                                </a>
                            )}
                        </div>
                    </section>
                )}

                {/* Share Button */}
                <section className="mb-6">
                    <Button
                        onClick={handleShare}
                        variant="outline"
                        className="w-full"
                    >
                        <Share2 className="w-4 h-4 mr-2" />
                        {t('events.share')}
                    </Button>
                </section>

                {/* Owner Actions */}
                {event.is_owner && (
                    <section className="border-t border-border pt-6">
                        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {event.views_count} {t('events.views')}
                            </span>
                            <span className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {event.favorites_count} {t('events.favorites_count')}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <Button asChild variant="outline" className="flex-1">
                                <Link href={`/events/${event.slug}/edit`}>
                                    <Pencil className="w-4 h-4 mr-2" />
                                    {t('publish.edit_title')}
                                </Link>
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </section>
                )}
            </div>

        </MobileLayout>
    );
}
