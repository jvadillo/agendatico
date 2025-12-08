<?php

use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\PlaceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes (No authentication required)
|--------------------------------------------------------------------------
*/

// Welcome / Splash screen
Route::get('/welcome', function () {
    return Inertia::render('welcome');
})->name('welcome');

// Home - Event listing (public)
Route::get('/', [EventController::class, 'index'])->name('home');
Route::get('/events', [EventController::class, 'index'])->name('events.index');

// Event detail (public)
Route::get('/events/{event:slug}', [EventController::class, 'show'])->name('events.show');

// Places API (public)
Route::get('/api/places', [PlaceController::class, 'index'])->name('api.places.index');
Route::get('/api/places/search', [PlaceController::class, 'search'])->name('api.places.search');

// Locale switching
Route::post('/locale', [LocaleController::class, 'switch'])->name('locale.switch');

// Legal pages
Route::get('/privacy', fn() => Inertia::render('legal/privacy'))->name('privacy');
Route::get('/terms', fn() => Inertia::render('legal/terms'))->name('terms');
Route::get('/data-deletion', fn() => Inertia::render('legal/data-deletion'))->name('data-deletion');

// Favorites API
Route::get('/api/favorites', [FavoriteController::class, 'index'])->name('api.favorites.index');

/*
|--------------------------------------------------------------------------
| Social Authentication Routes
|--------------------------------------------------------------------------
*/

Route::get('/auth/{provider}/redirect', [SocialAuthController::class, 'redirect'])
    ->name('social.redirect');
Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'callback'])
    ->name('social.callback');

/*
|--------------------------------------------------------------------------
| Protected Routes (Authentication required)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {
    // Favorites page (authenticated only)
    Route::get('/favorites', [FavoriteController::class, 'page'])->name('favorites');

    // Create event
    Route::get('/publish', [EventController::class, 'create'])->name('events.create');
    Route::post('/events', [EventController::class, 'store'])->name('events.store');

    // Edit/Delete event (owner only)
    Route::get('/events/{event:slug}/edit', [EventController::class, 'edit'])->name('events.edit');
    Route::put('/events/{event:slug}', [EventController::class, 'update'])->name('events.update');
    Route::delete('/events/{event:slug}', [EventController::class, 'destroy'])->name('events.destroy');

    // User's events
    Route::get('/my-events', [EventController::class, 'myEvents'])->name('events.my');

    // Favorites API (authenticated)
    Route::post('/api/events/{event}/favorite', [FavoriteController::class, 'toggle'])->name('api.favorites.toggle');
    Route::post('/api/favorites/sync', [FavoriteController::class, 'sync'])->name('api.favorites.sync');
});

require __DIR__.'/settings.php';
