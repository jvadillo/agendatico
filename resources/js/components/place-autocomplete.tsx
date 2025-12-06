import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';

interface PlaceAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onPlaceSelect?: (place: {
        address: string;
        latitude: number;
        longitude: number;
        name?: string;
    }) => void;
    placeholder?: string;
    className?: string;
    name?: string;
    id?: string;
}

// Check if Google Maps is loaded
const isGoogleMapsLoaded = () => {
    return typeof window !== 'undefined' && window.google?.maps?.places !== undefined;
};

export function PlaceAutocomplete({
    value,
    onChange,
    onPlaceSelect,
    placeholder = 'Buscar dirección...',
    className,
    name,
    id,
}: PlaceAutocompleteProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const [isLoading, setIsLoading] = useState(!isGoogleMapsLoaded());
    const [hasError, setHasError] = useState(false);
    const listenerRef = useRef<google.maps.MapsEventListener | null>(null);

    useEffect(() => {
        // If already loaded, skip script loading
        if (isGoogleMapsLoaded()) {
            setIsLoading(false);
            return;
        }

        // Check if script is already being loaded
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
            // Wait for it to load
            const handleLoad = () => setIsLoading(false);
            const handleError = () => {
                console.error('Error loading Google Maps API');
                setIsLoading(false);
                setHasError(true);
            };
            
            existingScript.addEventListener('load', handleLoad);
            existingScript.addEventListener('error', handleError);
            return () => {
                existingScript.removeEventListener('load', handleLoad);
                existingScript.removeEventListener('error', handleError);
            };
        }

        // Load Google Maps API with Places library
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&language=es&region=CR`;
        script.async = true;
        script.defer = true;
        script.onload = () => setIsLoading(false);
        script.onerror = () => {
            console.error('Error loading Google Maps API');
            setIsLoading(false);
            setHasError(true);
        };
        document.head.appendChild(script);
    }, []);

    useEffect(() => {
        if (isLoading || !inputRef.current || autocompleteRef.current || hasError) return;

        try {
            // Create autocomplete with restrictions for Costa Rica
            autocompleteRef.current = new google.maps.places.Autocomplete(
                inputRef.current,
                {
                    types: ['establishment', 'geocode'],
                    componentRestrictions: { country: 'cr' },
                    fields: ['formatted_address', 'geometry', 'name', 'place_id', 'address_components'],
                }
            );

            // Listen for place selection
            listenerRef.current = autocompleteRef.current.addListener('place_changed', () => {
                const place = autocompleteRef.current?.getPlace();
                
                if (place?.geometry?.location && place.formatted_address) {
                    const selectedPlace = {
                        address: place.formatted_address,
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng(),
                        name: place.name,
                    };

                    onChange(place.formatted_address);
                    onPlaceSelect?.(selectedPlace);
                }
            });
        } catch (error) {
            console.error('Error creating autocomplete:', error);
            setHasError(true);
        }

        return () => {
            if (listenerRef.current) {
                google.maps.event.removeListener(listenerRef.current);
            }
        };
    }, [isLoading, onChange, onPlaceSelect, hasError]);

    return (
        <Input
            ref={inputRef}
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={
                isLoading 
                    ? 'Cargando...' 
                    : hasError 
                    ? 'Escribe la dirección (autocompletado no disponible)' 
                    : placeholder
            }
            disabled={isLoading}
            className={className}
            name={name}
            id={id}
            autoComplete="off"
        />
    );
}
