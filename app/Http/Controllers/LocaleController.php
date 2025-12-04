<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

class LocaleController extends Controller
{
    /**
     * Switch the current locale.
     */
    public function switch(Request $request): JsonResponse
    {
        $request->validate([
            'locale' => ['required', 'string', 'in:es,en'],
        ]);

        $locale = $request->input('locale');

        // Set locale cookie for 1 year
        $cookie = Cookie::make('locale', $locale, 60 * 24 * 365);

        return response()
            ->json(['success' => true, 'locale' => $locale])
            ->withCookie($cookie);
    }
}
