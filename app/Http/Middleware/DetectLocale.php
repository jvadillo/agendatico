<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class DetectLocale
{
    /**
     * Supported locales
     */
    protected array $supportedLocales = ['es', 'en'];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $this->detectLocale($request);
        
        App::setLocale($locale);
        
        return $next($request);
    }

    /**
     * Detect the best locale for the user
     */
    protected function detectLocale(Request $request): string
    {
        // 1. Check if user has a saved preference in cookie
        if ($cookieLocale = $request->cookie('locale')) {
            if (in_array($cookieLocale, $this->supportedLocales)) {
                return $cookieLocale;
            }
        }

        // 2. Check if user has a saved preference in session
        if ($sessionLocale = session('locale')) {
            if (in_array($sessionLocale, $this->supportedLocales)) {
                return $sessionLocale;
            }
        }

        // 3. Detect from browser's Accept-Language header
        $browserLocale = $this->detectBrowserLocale($request);
        if ($browserLocale) {
            return $browserLocale;
        }

        // 4. Fall back to default locale
        return config('app.locale', 'es');
    }

    /**
     * Detect locale from browser's Accept-Language header
     */
    protected function detectBrowserLocale(Request $request): ?string
    {
        $acceptLanguage = $request->header('Accept-Language');
        
        if (!$acceptLanguage) {
            return null;
        }

        // Parse Accept-Language header
        // Format: en-US,en;q=0.9,es;q=0.8
        $languages = [];
        
        foreach (explode(',', $acceptLanguage) as $lang) {
            $parts = explode(';', trim($lang));
            $locale = trim($parts[0]);
            
            // Extract quality factor (default 1.0)
            $quality = 1.0;
            if (isset($parts[1])) {
                $qPart = trim($parts[1]);
                if (str_starts_with($qPart, 'q=')) {
                    $quality = (float) substr($qPart, 2);
                }
            }
            
            // Get base language (e.g., 'en' from 'en-US')
            $baseLocale = strtolower(substr($locale, 0, 2));
            
            if (in_array($baseLocale, $this->supportedLocales)) {
                $languages[$baseLocale] = max($languages[$baseLocale] ?? 0, $quality);
            }
        }

        if (empty($languages)) {
            return null;
        }

        // Sort by quality and return the best match
        arsort($languages);
        return array_key_first($languages);
    }
}
