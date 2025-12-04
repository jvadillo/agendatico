<?php

namespace App\Http\Controllers;

use App\Models\Place;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlaceController extends Controller
{
    /**
     * Search places for autocomplete.
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'town_id' => ['nullable', 'integer', 'exists:towns,id'],
        ]);

        $query = Place::active()->with('town');

        if ($request->filled('town_id')) {
            $query->inTown($request->town_id);
        }

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        $places = $query->orderBy('name')->limit(20)->get();

        return response()->json([
            'places' => $places,
        ]);
    }

    /**
     * Get all places grouped by town.
     */
    public function index(): JsonResponse
    {
        $places = Place::active()
            ->with('town')
            ->orderBy('name')
            ->get()
            ->groupBy('town_id');

        return response()->json([
            'places' => $places,
        ]);
    }
}
