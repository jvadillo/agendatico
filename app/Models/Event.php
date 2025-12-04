<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'user_id',
        'category_id',
        'town_id',
        'place_id',
        'starts_at',
        'ends_at',
        'address',
        'latitude',
        'longitude',
        'organizer_name',
        'price_type',
        'price_amount',
        'image_path',
        'instagram_url',
        'whatsapp_url',
        'website_url',
        'views_count',
        'favorites_count',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'views_count' => 'integer',
        'favorites_count' => 'integer',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($event) {
            if (empty($event->slug)) {
                $event->slug = Str::slug($event->title) . '-' . Str::random(6);
            }
        });
    }

    /**
     * Get the user who created this event.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category of this event.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the town where this event takes place.
     */
    public function town(): BelongsTo
    {
        return $this->belongsTo(Town::class);
    }

    /**
     * Get the place where this event takes place.
     */
    public function place(): BelongsTo
    {
        return $this->belongsTo(Place::class);
    }

    /**
     * Get the users who favorited this event.
     */
    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites')
            ->withTimestamps();
    }

    /**
     * Check if an event is favorited by a user.
     */
    public function isFavoritedBy(?User $user): bool
    {
        if (!$user) {
            return false;
        }
        return $this->favoritedBy()->where('user_id', $user->id)->exists();
    }

    /**
     * Get the image URL.
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) {
            return null;
        }
        return asset('storage/' . $this->image_path);
    }

    /**
     * Get formatted price display.
     */
    public function getPriceDisplayAttribute(): string
    {
        return match ($this->price_type) {
            'free' => 'Gratis',
            'donation' => 'Donación',
            'paid' => $this->price_amount ?? 'Pago',
            default => 'Gratis',
        };
    }

    /**
     * Get Google Maps URL.
     */
    public function getMapsUrlAttribute(): ?string
    {
        if ($this->latitude && $this->longitude) {
            return "https://www.google.com/maps/search/?api=1&query={$this->latitude},{$this->longitude}";
        }
        if ($this->address) {
            return "https://www.google.com/maps/search/?api=1&query=" . urlencode($this->address);
        }
        return null;
    }

    /**
     * Increment view count.
     */
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    /**
     * Scope to filter upcoming events.
     */
    public function scopeUpcoming($query)
    {
        return $query->where('starts_at', '>=', now());
    }

    /**
     * Scope to filter by town.
     */
    public function scopeInTown($query, $townId)
    {
        if ($townId) {
            return $query->where('town_id', $townId);
        }
        return $query;
    }

    /**
     * Scope to filter by category.
     */
    public function scopeInCategory($query, $categoryId)
    {
        if ($categoryId) {
            return $query->where('category_id', $categoryId);
        }
        return $query;
    }

    /**
     * Scope to filter by date range.
     */
    public function scopeDateFilter($query, $filter)
    {
        return match ($filter) {
            'today' => $query->whereDate('starts_at', today()),
            'week' => $query->whereBetween('starts_at', [now()->startOfDay(), now()->endOfWeek()]),
            'month' => $query->whereBetween('starts_at', [now()->startOfDay(), now()->endOfMonth()]),
            default => $query->where('starts_at', '>=', now()),
        };
    }

    /**
     * Scope to filter by price type.
     */
    public function scopePriceFilter($query, $priceType)
    {
        if ($priceType && $priceType !== 'any') {
            return $query->where('price_type', $priceType);
        }
        return $query;
    }

    /**
     * Scope to search by title or description.
     */
    public function scopeSearch($query, $search)
    {
        if ($search) {
            return $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        return $query;
    }

    /**
     * Scope to order by start date.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('starts_at', 'asc');
    }
}
