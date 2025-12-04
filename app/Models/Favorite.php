<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Favorite extends Model
{
    protected $fillable = [
        'user_id',
        'event_id',
    ];

    /**
     * Get the user who favorited.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the favorited event.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
