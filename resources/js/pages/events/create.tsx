import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState, useRef, useMemo } from 'react';
import { ChevronLeft, Image as ImageIcon, X, Instagram, MessageCircle, Globe } from 'lucide-react';
import MobileLayout from '@/layouts/mobile-layout';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { resizeImage, createImagePreview, revokeImagePreview } from '@/lib/image-utils';
import { cn } from '@/lib/utils';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Town {
    id: number;
    name: string;
    slug: string;
}

interface Place {
    id: number;
    name: string;
    slug: string;
    town_id: number;
    address: string | null;
    town: Town;
}

interface Props {
    towns: Town[];
    categories: Category[];
    places: Place[];
}

export default function EventCreate({ towns, categories, places }: Props) {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [placeSearch, setPlaceSearch] = useState('');
    const [showPlaceSuggestions, setShowPlaceSuggestions] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        category_id: '',
        town_id: '',
        place_id: '',
        starts_at: '',
        ends_at: '',
        address: '',
        organizer_name: '',
        price_type: 'free',
        price_amount: '',
        instagram_url: '',
        whatsapp_url: '',
        website_url: '',
        image: null as File | null,
        is_recurring: false,
        recurrence_frequency: '',
        recurrence_end_date: '',
    });

    const [recurringError, setRecurringError] = useState<string>('');

    const calculateEventCount = () => {
        if (!data.is_recurring || !data.starts_at || !data.recurrence_frequency || !data.recurrence_end_date) {
            return 0;
        }
        
        const start = new Date(data.starts_at);
        const end = new Date(data.recurrence_end_date);
        
        if (end <= start) return 0;
        
        let count = 0;
        const current = new Date(start);
        
        while (current <= end && count <= 30) {
            count++;
            if (data.recurrence_frequency === 'weekly') {
                current.setDate(current.getDate() + 7);
            } else if (data.recurrence_frequency === 'monthly') {
                current.setMonth(current.getMonth() + 1);
            }
        }
        
        return count;
    };

    // Filter places when town changes - use useMemo instead of useEffect
    const filteredPlaces = useMemo(() => {
        if (data.town_id) {
            return places.filter(p => String(p.town_id) === data.town_id);
        }
        return places;
    }, [data.town_id, places]);

    // Filter places by search
    const searchedPlaces = placeSearch
        ? filteredPlaces.filter(p => 
            p.name.toLowerCase().includes(placeSearch.toLowerCase())
          )
        : filteredPlaces;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setRecurringError('');
        
        if (data.is_recurring) {
            const count = calculateEventCount();
            if (count > 20) {
                setRecurringError(`No se pueden crear más de 20 eventos de forma periódica. Esta configuración crearía ${count} eventos.`);
                return;
            }
        }
        
        post('/events', {
            forceFormData: true,
        });
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // Resize image before uploading
            const resizedFile = await resizeImage(file, {
                maxWidth: 1200,
                maxHeight: 1200,
                quality: 0.85,
            });

            setData('image', resizedFile);

            // Create preview
            if (imagePreview) {
                revokeImagePreview(imagePreview);
            }
            setImagePreview(createImagePreview(resizedFile));
        } catch (error) {
            console.error('Error processing image:', error);
        }
    };

    const removeImage = () => {
        setData('image', null);
        if (imagePreview) {
            revokeImagePreview(imagePreview);
            setImagePreview(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const selectPlace = (place: Place) => {
        setData('place_id', String(place.id));
        setPlaceSearch(place.name);
        setShowPlaceSuggestions(false);
        // Auto-fill address if place has one
        if (place.address && !data.address) {
            setData('address', place.address);
        }
    };

    return (
        <MobileLayout hideNav>
            <Head title={t('publish.title')} />

            {/* Header - mobile only */}
            <header className="sticky top-0 z-40 bg-background border-b border-border md:hidden">
                <div className="flex items-center justify-between p-4">
                    <Link href="/" className="icon-btn">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="font-semibold">{t('publish.title')}</h1>
                    <div className="w-9" /> {/* Spacer */}
                </div>
            </header>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 pb-8 md:max-w-2xl md:mx-auto md:py-8">
                {/* Desktop title */}
                <h1 className="hidden md:block text-2xl font-bold mb-6">{t('publish.title')}</h1>
                {/* Title */}
                <div className="mb-4">
                    <Label htmlFor="title">{t('publish.event_title')}</Label>
                    <Input
                        id="title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder={t('publish.event_title_placeholder')}
                        className={cn(errors.title && 'border-destructive')}
                    />
                    {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
                </div>

                {/* Description */}
                <div className="mb-4">
                    <Label htmlFor="description">{t('publish.description')}</Label>
                    <textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder={t('publish.description_placeholder')}
                        rows={4}
                        className={cn(
                            'w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            errors.description && 'border-destructive'
                        )}
                    />
                    {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <Label htmlFor="starts_at">{t('publish.start_date')}</Label>
                        <Input
                            id="starts_at"
                            type="datetime-local"
                            value={data.starts_at}
                            onChange={(e) => setData('starts_at', e.target.value)}
                            className={cn(errors.starts_at && 'border-destructive')}
                        />
                        {errors.starts_at && <p className="text-sm text-destructive mt-1">{errors.starts_at}</p>}
                    </div>
                    <div>
                        <Label htmlFor="ends_at">{t('publish.end_date')}</Label>
                        <Input
                            id="ends_at"
                            type="datetime-local"
                            value={data.ends_at}
                            onChange={(e) => setData('ends_at', e.target.value)}
                        />
                    </div>
                </div>

                {/* Recurring Event */}
                <div className="mb-4 p-4 border border-border rounded-lg bg-secondary/30">
                    <label className="flex items-center gap-2 cursor-pointer mb-3">
                        <input
                            type="checkbox"
                            checked={data.is_recurring}
                            onChange={(e) => {
                                setData('is_recurring', e.target.checked);
                                if (!e.target.checked) {
                                    setData('recurrence_frequency', '');
                                    setData('recurrence_end_date', '');
                                    setRecurringError('');
                                }
                            }}
                            className="w-4 h-4 rounded border-input"
                        />
                        <span className="font-medium">{t('publish.is_recurring')}</span>
                    </label>
                    
                    {data.is_recurring && (
                        <div className="space-y-3 pl-6">
                            <div>
                                <Label>{t('publish.recurrence_frequency')}</Label>
                                <Select 
                                    value={data.recurrence_frequency} 
                                    onValueChange={(value) => {
                                        setData('recurrence_frequency', value);
                                        setRecurringError('');
                                    }}
                                >
                                    <SelectTrigger className={cn(errors.recurrence_frequency && 'border-destructive')}>
                                        <SelectValue placeholder={t('publish.select_frequency')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="weekly">{t('publish.weekly')}</SelectItem>
                                        <SelectItem value="monthly">{t('publish.monthly')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.recurrence_frequency && (
                                    <p className="text-sm text-destructive mt-1">{errors.recurrence_frequency}</p>
                                )}
                            </div>
                            
                            <div>
                                <Label htmlFor="recurrence_end_date">{t('publish.recurrence_end_date')}</Label>
                                <Input
                                    id="recurrence_end_date"
                                    type="date"
                                    value={data.recurrence_end_date}
                                    onChange={(e) => {
                                        setData('recurrence_end_date', e.target.value);
                                        setRecurringError('');
                                    }}
                                    className={cn(errors.recurrence_end_date && 'border-destructive')}
                                />
                                {errors.recurrence_end_date && (
                                    <p className="text-sm text-destructive mt-1">{errors.recurrence_end_date}</p>
                                )}
                            </div>
                            
                            {recurringError && (
                                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                    {recurringError}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Category */}
                <div className="mb-4">
                    <Label>{t('publish.category')}</Label>
                    <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                        <SelectTrigger className={cn(errors.category_id && 'border-destructive')}>
                            <SelectValue placeholder={t('publish.select_category')} />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={String(category.id)}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.category_id && <p className="text-sm text-destructive mt-1">{errors.category_id}</p>}
                </div>

                {/* Image Upload */}
                <div className="mb-4">
                    <Label>{t('publish.image')}</Label>
                    <div className="file-upload-wrapper">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {imagePreview ? (
                            <div className="relative w-full">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 icon-btn bg-black/50 text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground py-4">
                                <ImageIcon className="w-8 h-8" />
                                <span className="text-sm">{t('publish.upload_image')}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Town */}
                <div className="mb-4">
                    <Label>{t('publish.town')}</Label>
                    <Select value={data.town_id} onValueChange={(value) => setData('town_id', value)}>
                        <SelectTrigger className={cn(errors.town_id && 'border-destructive')}>
                            <SelectValue placeholder={t('publish.select_town')} />
                        </SelectTrigger>
                        <SelectContent>
                            {towns.map((town) => (
                                <SelectItem key={town.id} value={String(town.id)}>
                                    {town.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.town_id && <p className="text-sm text-destructive mt-1">{errors.town_id}</p>}
                </div>

                {/* Place (Autocomplete) */}
                <div className="mb-4 relative">
                    <Label htmlFor="place">{t('publish.place')}</Label>
                    <Input
                        id="place"
                        value={placeSearch}
                        onChange={(e) => {
                            setPlaceSearch(e.target.value);
                            setShowPlaceSuggestions(true);
                            if (!e.target.value) {
                                setData('place_id', '');
                            }
                        }}
                        onFocus={() => setShowPlaceSuggestions(true)}
                        placeholder={t('publish.place_placeholder')}
                        autoComplete="off"
                    />
                    {showPlaceSuggestions && searchedPlaces.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {searchedPlaces.map((place) => (
                                <button
                                    key={place.id}
                                    type="button"
                                    onClick={() => selectPlace(place)}
                                    className="w-full px-3 py-2 text-left hover:bg-secondary text-sm"
                                >
                                    <span className="font-medium">{place.name}</span>
                                    {place.town && (
                                        <span className="text-muted-foreground ml-2">
                                            ({place.town.name})
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Address */}
                <div className="mb-4">
                    <Label htmlFor="address">{t('publish.address')}</Label>
                    <Input
                        id="address"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        placeholder={t('publish.address_placeholder')}
                    />
                    {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
                </div>

                {/* Organizer */}
                <div className="mb-4">
                    <Label htmlFor="organizer">{t('publish.organizer')}</Label>
                    <Input
                        id="organizer"
                        value={data.organizer_name}
                        onChange={(e) => setData('organizer_name', e.target.value)}
                        placeholder={t('publish.organizer_placeholder')}
                    />
                </div>

                {/* Price */}
                <div className="mb-4">
                    <Label>{t('publish.price')}</Label>
                    <div className="flex gap-2 mt-2">
                        {(['free', 'donation', 'paid'] as const).map((type) => (
                            <label key={type} className="radio-chip">
                                <input
                                    type="radio"
                                    name="price_type"
                                    value={type}
                                    checked={data.price_type === type}
                                    onChange={() => setData('price_type', type)}
                                />
                                <span>
                                    {type === 'free' && t('publish.price_free')}
                                    {type === 'donation' && t('publish.price_donation')}
                                    {type === 'paid' && t('publish.price_paid')}
                                </span>
                            </label>
                        ))}
                    </div>
                    {data.price_type === 'paid' && (
                        <Input
                            className="mt-2"
                            value={data.price_amount}
                            onChange={(e) => setData('price_amount', e.target.value)}
                            placeholder={t('publish.price_amount_placeholder')}
                        />
                    )}
                    {errors.price_amount && <p className="text-sm text-destructive mt-1">{errors.price_amount}</p>}
                </div>

                {/* Social Links */}
                <div className="space-y-4 mb-6">
                    <div>
                        <Label htmlFor="instagram" className="flex items-center gap-2 mb-1">
                            <Instagram className="w-4 h-4" />
                            {t('publish.instagram')}
                        </Label>
                        <Input
                            id="instagram"
                            value={data.instagram_url}
                            onChange={(e) => setData('instagram_url', e.target.value)}
                            placeholder={t('publish.instagram_placeholder')}
                        />
                    </div>
                    <div>
                        <Label htmlFor="whatsapp" className="flex items-center gap-2 mb-1">
                            <MessageCircle className="w-4 h-4" />
                            {t('publish.whatsapp')}
                        </Label>
                        <Input
                            id="whatsapp"
                            value={data.whatsapp_url}
                            onChange={(e) => setData('whatsapp_url', e.target.value)}
                            placeholder={t('publish.whatsapp_placeholder')}
                        />
                    </div>
                    <div>
                        <Label htmlFor="website" className="flex items-center gap-2 mb-1">
                            <Globe className="w-4 h-4" />
                            {t('publish.website')}
                        </Label>
                        <Input
                            id="website"
                            type="text"
                            value={data.website_url}
                            onChange={(e) => setData('website_url', e.target.value)}
                            placeholder={t('publish.website_placeholder')}
                        />
                    </div>
                </div>

                {/* Submit */}
                <Button type="submit" className="w-full" disabled={processing}>
                    {processing ? '...' : t('publish.submit')}
                </Button>
            </form>
        </MobileLayout>
    );
}
