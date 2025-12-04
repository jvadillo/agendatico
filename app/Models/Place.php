<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Place extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'town_id',
        'address',
        'latitude',
        'longitude',
        'type',
        'is_active',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'is_active' => 'boolean',
    ];

    /**
     * Get the town this place belongs to.
     */
    public function town(): BelongsTo
    {
        return $this->belongsTo(Town::class);
    }

    /**
     * Get the events at this place.
     */
    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    /**
     * Scope to get only active places.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to filter by town.
     */
    public function scopeInTown($query, $townId)
    {
        return $query->where('town_id', $townId);
    }

    /**
     * Scope to search by name.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'like', "%{$search}%");
    }
}
