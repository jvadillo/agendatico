<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Town extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'latitude',
        'longitude',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'is_active' => 'boolean',
    ];

    /**
     * Get the places in this town.
     */
    public function places(): HasMany
    {
        return $this->hasMany(Place::class);
    }

    /**
     * Get the events in this town.
     */
    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    /**
     * Scope to get only active towns.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by sort order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('name');
    }
}
