<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FavoriteController extends Controller
{
    /**
     * Show the favorites page.
     */
    public function page(Request $request): Response
    {
        $user = $request->user();

        // For authenticated users, get their favorited events
        // For guests, they'll use localStorage so we pass an empty array
        $events = [];

        if ($user) {
            $events = $user->favoriteEvents()
                ->with(['category', 'town'])
                ->where('starts_at', '>=', now())
                ->whereNull('deleted_at')
                ->orderBy('starts_at')
                ->get();
        }

        return Inertia::render('events/favorites', [
            'events' => $events,
        ]);
    }

    /**
     * Toggle favorite status for an event.
     */
    public function toggle(Request $request, Event $event): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required',
            ], 401);
        }

        $isFavorited = $user->toggleFavorite($event);

        return response()->json([
            'success' => true,
            'is_favorited' => $isFavorited,
            'favorites_count' => $event->fresh()->favorites_count,
        ]);
    }

    /**
     * Get user's favorite event IDs.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'favorites' => [],
            ]);
        }

        $favoriteIds = $user->favoriteEvents()->pluck('event_id');

        return response()->json([
            'favorites' => $favoriteIds,
        ]);
    }

    /**
     * Sync favorites from localStorage to database.
     */
    public function sync(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required',
            ], 401);
        }

        $request->validate([
            'event_ids' => ['required', 'array'],
            'event_ids.*' => ['integer', 'exists:events,id'],
        ]);

        $eventIds = $request->input('event_ids', []);

        // Get existing favorites
        $existingFavorites = $user->favoriteEvents()->pluck('event_id')->toArray();

        // Find new favorites to add
        $toAdd = array_diff($eventIds, $existingFavorites);

        foreach ($toAdd as $eventId) {
            $event = Event::find($eventId);
            if ($event) {
                $user->favoriteEvents()->attach($eventId);
                $event->increment('favorites_count');
            }
        }

        return response()->json([
            'success' => true,
            'synced_count' => count($toAdd),
            'favorites' => $user->favoriteEvents()->pluck('event_id'),
        ]);
    }
}
