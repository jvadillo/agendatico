<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Models\Category;
use App\Models\Event;
use App\Models\Place;
use App\Models\Town;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    /**
     * Display a listing of events.
     */
    public function index(Request $request): Response
    {
        $events = Event::with(['category', 'town', 'place'])
            ->upcoming()
            ->inTown($request->town)
            ->inCategory($request->category)
            ->dateFilter($request->date)
            ->priceFilter($request->price)
            ->search($request->search)
            ->ordered()
            ->paginate(12)
            ->withQueryString();

        // Add favorite status for authenticated user
        $user = auth()->user();
        $favoriteIds = [];
        if ($user) {
            $favoriteIds = $user->favoriteEvents()->pluck('event_id')->toArray();
        }

        $events->getCollection()->transform(function ($event) use ($favoriteIds) {
            $event->is_favorited = in_array($event->id, $favoriteIds);
            return $event;
        });

        return Inertia::render('events/index', [
            'events' => $events,
            'towns' => Town::active()->ordered()->get(),
            'categories' => Category::active()->ordered()->get(),
            'filters' => [
                'town' => $request->town,
                'category' => $request->category,
                'date' => $request->date,
                'price' => $request->price,
                'search' => $request->search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new event.
     */
    public function create(): Response
    {
        return Inertia::render('events/create', [
            'towns' => Town::active()->ordered()->get(),
            'categories' => Category::active()->ordered()->get(),
            'places' => Place::active()->with('town')->get(),
        ]);
    }

    /**
     * Store a newly created event.
     */
    public function store(StoreEventRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();

        // Handle image upload
        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('events', 'public');
        }

        $event = Event::create($data);

        return redirect()
            ->route('events.show', $event)
            ->with('success', __('messages.event_created'));
    }

    /**
     * Display the specified event.
     */
    public function show(Event $event): Response
    {
        // Increment view count
        $event->incrementViews();

        $event->load(['category', 'town', 'place', 'user']);

        // Check if user has favorited
        $user = auth()->user();
        $event->is_favorited = $user ? $user->hasFavorited($event) : false;
        $event->is_owner = $user ? $user->id === $event->user_id : false;

        return Inertia::render('events/show', [
            'event' => $event,
        ]);
    }

    /**
     * Show the form for editing the specified event.
     */
    public function edit(Event $event): Response
    {
        // Ensure user owns the event
        if (auth()->id() !== $event->user_id) {
            abort(403);
        }

        return Inertia::render('events/edit', [
            'event' => $event->load(['category', 'town', 'place']),
            'towns' => Town::active()->ordered()->get(),
            'categories' => Category::active()->ordered()->get(),
            'places' => Place::active()->with('town')->get(),
        ]);
    }

    /**
     * Update the specified event.
     */
    public function update(UpdateEventRequest $request, Event $event)
    {
        $data = $request->validated();

        // Handle image upload/removal
        if ($request->hasFile('image')) {
            // Delete old image
            if ($event->image_path) {
                Storage::disk('public')->delete($event->image_path);
            }
            $data['image_path'] = $request->file('image')->store('events', 'public');
        } elseif ($request->boolean('remove_image') && $event->image_path) {
            Storage::disk('public')->delete($event->image_path);
            $data['image_path'] = null;
        }

        unset($data['remove_image']);
        $event->update($data);

        return redirect()
            ->route('events.show', $event)
            ->with('success', __('messages.event_updated'));
    }

    /**
     * Remove the specified event.
     */
    public function destroy(Event $event)
    {
        // Ensure user owns the event
        if (auth()->id() !== $event->user_id) {
            abort(403);
        }

        // Delete image
        if ($event->image_path) {
            Storage::disk('public')->delete($event->image_path);
        }

        $event->delete();

        return redirect()
            ->route('events.index')
            ->with('success', __('messages.event_deleted'));
    }

    /**
     * Display user's own events.
     */
    public function myEvents(): Response
    {
        $events = Event::with(['category', 'town'])
            ->where('user_id', auth()->id())
            ->withTrashed()
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return Inertia::render('events/my-events', [
            'events' => $events,
        ]);
    }
}
