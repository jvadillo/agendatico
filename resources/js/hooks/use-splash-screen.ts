import { useState, useEffect } from 'react';

const SPLASH_STORAGE_KEY = 'agendatico_splash_shown';
const SPLASH_EXPIRY_HOURS = 24; // Mostrar el splash cada 24 horas

export function useSplashScreen() {
    const [showSplash, setShowSplash] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Detectar si es móvil
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        
        // Solo mostrar en móvil
        if (window.innerWidth >= 768) {
            return;
        }

        // Verificar si ya se mostró recientemente
        const splashData = localStorage.getItem(SPLASH_STORAGE_KEY);
        
        if (splashData) {
            const { timestamp } = JSON.parse(splashData);
            const hoursSinceShown = (Date.now() - timestamp) / (1000 * 60 * 60);
            
            if (hoursSinceShown < SPLASH_EXPIRY_HOURS) {
                // Ya se mostró hace poco, no mostrar
                return;
            }
        }

        // Mostrar el splash
        setShowSplash(true);

        // Ocultar después de 3.5 segundos
        const timer = setTimeout(() => {
            setShowSplash(false);
            
            // Guardar que ya se mostró
            localStorage.setItem(SPLASH_STORAGE_KEY, JSON.stringify({
                timestamp: Date.now()
            }));
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    const handleSplashComplete = () => {
        setShowSplash(false);
        setIsExiting(false);
    };

    return {
        showSplash: showSplash && isMobile,
        isExiting,
        handleSplashComplete,
    };
}
