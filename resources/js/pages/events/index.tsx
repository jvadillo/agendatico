import { Head, Link, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { Search, SlidersHorizontal, MapPin, Calendar, Heart, Clock } from 'lucide-react';
import MobileLayout from '@/layouts/mobile-layout';
import { FilterModal, FilterSection, RadioOption } from '@/components/filter-modal';
import { useTranslation } from '@/hooks/use-translation';
import { useFavorites } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
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
    place?: { name: string } | null;
    is_favorited?: boolean;
}

interface PaginatedEvents {
    data: Event[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
}

interface Filters {
    town: string | null;
    category: string | null;
    date: string | null;
    price: string | null;
    search: string | null;
}

interface Props {
    events: PaginatedEvents;
    towns: Town[];
    categories: Category[];
    filters: Filters;
}

export default function EventsIndex({ events, towns, categories, filters }: Props) {
    const { t, locale } = useTranslation();
    const { toggleFavorite, isFavorited } = useFavorites();
    const dateLocale = locale === 'es' ? es : enUS;
    
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [showFiltersModal, setShowFiltersModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showDateModal, setShowDateModal] = useState(false);
    
    // Local filter state for modals
    const [localFilters, setLocalFilters] = useState<Filters>(filters);

    const applyFilters = useCallback((newFilters: Partial<Filters>) => {
        const merged = { ...filters, ...newFilters };
        router.get('/', {
            town: merged.town || undefined,
            category: merged.category || undefined,
            date: merged.date || undefined,
            price: merged.price || undefined,
            search: merged.search || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    }, [filters]);

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search: searchQuery || null });
    }, [searchQuery, applyFilters]);

    const handleCategoryClick = useCallback((categoryId: number) => {
        const newCategory = filters.category === String(categoryId) ? null : String(categoryId);
        applyFilters({ category: newCategory });
    }, [filters.category, applyFilters]);

    const handleFavoriteToggle = useCallback((e: React.MouseEvent, eventId: number) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(eventId);
    }, [toggleFavorite]);

    const clearFilters = useCallback(() => {
        setLocalFilters({
            town: null,
            category: null,
            date: null,
            price: null,
            search: null,
        });
    }, []);

    const applyAllFilters = useCallback(() => {
        applyFilters(localFilters);
        setShowFiltersModal(false);
    }, [localFilters, applyFilters]);

    // Get current filter labels
    const currentTown = towns.find(t => String(t.id) === filters.town);
    const dateLabels: Record<string, string> = {
        today: t('filters.today'),
        week: t('filters.this_week'),
        month: t('filters.this_month'),
    };

    // Category icons mapping (using emoji as fallback)
    const categoryIcons: Record<string, string> = {
        'live-music': '🎵',
        'parties-dj': '🎉',
        'yoga-wellness': '🧘',
        'workshops': '🎨',
        'outdoor-nature': '🌴',
        'markets-crafts': '🛍️',
        'culture-community': '🎭',
        'kids-family': '👨‍👩‍👧',
        'sports': '🏃',
        'other': '📌',
    };

    return (
        <MobileLayout>
            <Head title={t('home.upcoming_events')} />

            {/* Header */}
            <header className="bg-background pt-4 pb-2">
                {/* Search Bar */}
                <div className="px-4 mb-4">
                    <form onSubmit={handleSearch} className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder={t('home.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 rounded-full bg-muted/50 border-0 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowFiltersModal(true)}
                            className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0 hover:bg-violet-700 transition-colors"
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                        </button>
                    </form>
                </div>

                {/* Location & Date Pills */}
                <div className="flex gap-2 px-4 mb-4">
                    <button
                        onClick={() => setShowLocationModal(true)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer",
                            filters.town 
                                ? "bg-foreground text-background" 
                                : "bg-foreground text-background"
                        )}
                    >
                        <MapPin className="w-4 h-4" />
                        {currentTown?.name || t('home.any_location')}
                    </button>
                    <button
                        onClick={() => setShowDateModal(true)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer",
                            filters.date 
                                ? "bg-foreground text-background" 
                                : "bg-foreground text-background"
                        )}
                    >
                        <Calendar className="w-4 h-4" />
                        {filters.date ? dateLabels[filters.date] : t('home.any_date')}
                    </button>
                </div>

                {/* Category Chips - Horizontal Scroll */}
                <div className="scroll-container px-4">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border cursor-pointer",
                                filters.category === String(category.id)
                                    ? "bg-foreground text-background border-foreground"
                                    : "bg-background text-foreground border-border hover:border-foreground/30"
                            )}
                        >
                            <span>{categoryIcons[category.slug] || '📌'}</span>
                            <span>{category.name}</span>
                        </button>
                    ))}
                </div>
            </header>

            {/* Content */}
            <main className="px-4 pt-6 pb-4">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">{t('home.upcoming_events')}</h2>
                    <Link 
                        href="/events" 
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {t('home.see_all')}
                    </Link>
                </div>

                {/* Events List - Responsive grid on desktop */}
                {events.data.length > 0 ? (
                    <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
                        {events.data.map((event) => {
                            const eventDate = new Date(event.starts_at);
                            const formattedDate = format(eventDate, 'd MMM', { locale: dateLocale });
                            const formattedTime = format(eventDate, 'h:mma', { locale: dateLocale });
                            const locationName = event.place?.name || event.town.name;
                            
                            return (
                                <Link
                                    key={event.id}
                                    href={`/events/${event.slug}`}
                                    className="flex gap-4 group md:flex-col md:gap-0 md:rounded-xl md:border md:border-border md:overflow-hidden md:bg-card md:hover:shadow-lg md:transition-shadow"
                                >
                                    {/* Image */}
                                    <div className="w-28 h-28 rounded-xl overflow-hidden bg-muted shrink-0 md:w-full md:h-48 md:rounded-none">
                                        {event.image_url ? (
                                            <img 
                                                src={event.image_url} 
                                                alt={event.title} 
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div 
                                                className="w-full h-full flex items-center justify-center text-3xl md:text-5xl"
                                                style={{ backgroundColor: event.category.color + '15' }}
                                            >
                                                {categoryIcons[event.category.slug] || '📅'}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 py-1 md:p-4">
                                        <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                                            {event.title}
                                        </h3>
                                        
                                        <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                                            <Clock className="w-4 h-4" />
                                            <span>{formattedDate}, {formattedTime}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                                            <MapPin className="w-4 h-4" />
                                            <span className="truncate">{locationName}</span>
                                        </div>

                                        {/* Category Badge & Favorite */}
                                        <div className="flex items-center justify-between mt-3">
                                            <span 
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                                                style={{ 
                                                    backgroundColor: event.category.color + '15',
                                                    color: event.category.color 
                                                }}
                                            >
                                                <span>{categoryIcons[event.category.slug] || '📌'}</span>
                                                {event.category.name}
                                            </span>
                                            
                                            <button
                                                onClick={(e) => handleFavoriteToggle(e, event.id)}
                                                className="p-1.5 -m-1.5 hover:scale-110 transition-transform"
                                            >
                                                <Heart 
                                                    className={cn(
                                                        'w-5 h-5 transition-colors',
                                                        isFavorited(event.id)
                                                            ? 'fill-red-500 text-red-500' 
                                                            : 'text-muted-foreground/50'
                                                    )} 
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>{t('home.no_events')}</p>
                    </div>
                )}

                {/* Load More */}
                {events.next_page_url && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => router.get(events.next_page_url!, {}, { preserveState: true, preserveScroll: true })}
                            className="text-primary font-medium hover:underline"
                        >
                            {t('home.load_more')}
                        </button>
                    </div>
                )}
            </main>

            {/* Location Modal */}
            <FilterModal
                isOpen={showLocationModal}
                onClose={() => setShowLocationModal(false)}
                title={t('filters.location')}
                onApply={() => {
                    applyFilters({ town: localFilters.town });
                    setShowLocationModal(false);
                }}
                onClear={() => {
                    setLocalFilters(f => ({ ...f, town: null }));
                    applyFilters({ town: null });
                    setShowLocationModal(false);
                }}
            >
                <div className="space-y-1">
                    <RadioOption
                        name="town"
                        value=""
                        checked={!localFilters.town}
                        onChange={() => setLocalFilters(f => ({ ...f, town: null }))}
                    >
                        {t('home.any_location')}
                    </RadioOption>
                    {towns.map((town) => (
                        <RadioOption
                            key={town.id}
                            name="town"
                            value={String(town.id)}
                            checked={localFilters.town === String(town.id)}
                            onChange={(value) => setLocalFilters(f => ({ ...f, town: value }))}
                        >
                            {town.name}
                        </RadioOption>
                    ))}
                </div>
            </FilterModal>

            {/* Date Modal */}
            <FilterModal
                isOpen={showDateModal}
                onClose={() => setShowDateModal(false)}
                title={t('filters.date')}
                onApply={() => {
                    applyFilters({ date: localFilters.date });
                    setShowDateModal(false);
                }}
                onClear={() => {
                    setLocalFilters(f => ({ ...f, date: null }));
                    applyFilters({ date: null });
                    setShowDateModal(false);
                }}
            >
                <div className="space-y-1">
                    <RadioOption
                        name="date"
                        value=""
                        checked={!localFilters.date}
                        onChange={() => setLocalFilters(f => ({ ...f, date: null }))}
                    >
                        {t('home.any_date')}
                    </RadioOption>
                    <RadioOption
                        name="date"
                        value="today"
                        checked={localFilters.date === 'today'}
                        onChange={(value) => setLocalFilters(f => ({ ...f, date: value }))}
                    >
                        {t('filters.today')}
                    </RadioOption>
                    <RadioOption
                        name="date"
                        value="week"
                        checked={localFilters.date === 'week'}
                        onChange={(value) => setLocalFilters(f => ({ ...f, date: value }))}
                    >
                        {t('filters.this_week')}
                    </RadioOption>
                    <RadioOption
                        name="date"
                        value="month"
                        checked={localFilters.date === 'month'}
                        onChange={(value) => setLocalFilters(f => ({ ...f, date: value }))}
                    >
                        {t('filters.this_month')}
                    </RadioOption>
                </div>
            </FilterModal>

            {/* Full Filters Modal */}
            <FilterModal
                isOpen={showFiltersModal}
                onClose={() => setShowFiltersModal(false)}
                title={t('filters.title')}
                onApply={applyAllFilters}
                onClear={clearFilters}
            >
                <FilterSection title={t('filters.location')}>
                    <div className="space-y-1">
                        <RadioOption
                            name="filter-town"
                            value=""
                            checked={!localFilters.town}
                            onChange={() => setLocalFilters(f => ({ ...f, town: null }))}
                        >
                            {t('home.any_location')}
                        </RadioOption>
                        {towns.map((town) => (
                            <RadioOption
                                key={town.id}
                                name="filter-town"
                                value={String(town.id)}
                                checked={localFilters.town === String(town.id)}
                                onChange={(value) => setLocalFilters(f => ({ ...f, town: value }))}
                            >
                                {town.name}
                            </RadioOption>
                        ))}
                    </div>
                </FilterSection>

                <FilterSection title={t('filters.date')}>
                    <div className="space-y-1">
                        <RadioOption
                            name="filter-date"
                            value=""
                            checked={!localFilters.date}
                            onChange={() => setLocalFilters(f => ({ ...f, date: null }))}
                        >
                            {t('home.any_date')}
                        </RadioOption>
                        <RadioOption
                            name="filter-date"
                            value="today"
                            checked={localFilters.date === 'today'}
                            onChange={(value) => setLocalFilters(f => ({ ...f, date: value }))}
                        >
                            {t('filters.today')}
                        </RadioOption>
                        <RadioOption
                            name="filter-date"
                            value="week"
                            checked={localFilters.date === 'week'}
                            onChange={(value) => setLocalFilters(f => ({ ...f, date: value }))}
                        >
                            {t('filters.this_week')}
                        </RadioOption>
                        <RadioOption
                            name="filter-date"
                            value="month"
                            checked={localFilters.date === 'month'}
                            onChange={(value) => setLocalFilters(f => ({ ...f, date: value }))}
                        >
                            {t('filters.this_month')}
                        </RadioOption>
                    </div>
                </FilterSection>

                <FilterSection title={t('filters.price')}>
                    <div className="space-y-1">
                        <RadioOption
                            name="filter-price"
                            value=""
                            checked={!localFilters.price}
                            onChange={() => setLocalFilters(f => ({ ...f, price: null }))}
                        >
                            {t('filters.any_price')}
                        </RadioOption>
                        <RadioOption
                            name="filter-price"
                            value="free"
                            checked={localFilters.price === 'free'}
                            onChange={(value) => setLocalFilters(f => ({ ...f, price: value }))}
                        >
                            {t('filters.free')}
                        </RadioOption>
                        <RadioOption
                            name="filter-price"
                            value="donation"
                            checked={localFilters.price === 'donation'}
                            onChange={(value) => setLocalFilters(f => ({ ...f, price: value }))}
                        >
                            {t('filters.donation')}
                        </RadioOption>
                        <RadioOption
                            name="filter-price"
                            value="paid"
                            checked={localFilters.price === 'paid'}
                            onChange={(value) => setLocalFilters(f => ({ ...f, price: value }))}
                        >
                            {t('filters.paid')}
                        </RadioOption>
                    </div>
                </FilterSection>
            </FilterModal>
        </MobileLayout>
    );
}
