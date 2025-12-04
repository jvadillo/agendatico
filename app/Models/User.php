<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Get the events created by this user.
     */
    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    /**
     * Get the events favorited by this user.
     */
    public function favoriteEvents(): BelongsToMany
    {
        return $this->belongsToMany(Event::class, 'favorites')
            ->withTimestamps();
    }

    /**
     * Check if a user has favorited an event.
     */
    public function hasFavorited(Event $event): bool
    {
        return $this->favoriteEvents()->where('event_id', $event->id)->exists();
    }

    /**
     * Toggle favorite for an event.
     */
    public function toggleFavorite(Event $event): bool
    {
        if ($this->hasFavorited($event)) {
            $this->favoriteEvents()->detach($event->id);
            $event->decrement('favorites_count');
            return false;
        }

        $this->favoriteEvents()->attach($event->id);
        $event->increment('favorites_count');
        return true;
    }
}
