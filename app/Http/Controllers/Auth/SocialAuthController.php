<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Supported OAuth providers
     */
    protected array $providers = ['google', 'facebook'];

    /**
     * Redirect to provider for authentication
     */
    public function redirect(string $provider)
    {
        $this->validateProvider($provider);

        return Socialite::driver($provider)->stateless()->redirect();
    }

    /**
     * Handle callback from provider
     */
    public function callback(string $provider)
    {
        $this->validateProvider($provider);

        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Error al autenticar con ' . ucfirst($provider));
        }

        // Find user by email or social_id
        $user = User::where('email', $socialUser->getEmail())
            ->orWhere(function ($query) use ($socialUser, $provider) {
                $query->where('social_id', $socialUser->getId())
                    ->where('social_provider', $provider);
            })
            ->first();

        if ($user) {
            // Existing user - update social data if not set
            if (!$user->social_id) {
                $user->update([
                    'social_id' => $socialUser->getId(),
                    'social_provider' => $provider,
                    'avatar' => $socialUser->getAvatar(),
                ]);
            }
        } else {
            // Create new user
            $user = User::create([
                'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'Usuario',
                'email' => $socialUser->getEmail(),
                'email_verified_at' => now(),
                'password' => null, // No password for social users
                'social_id' => $socialUser->getId(),
                'social_provider' => $provider,
                'avatar' => $socialUser->getAvatar(),
            ]);
        }

        Auth::login($user, remember: true);

        return redirect()->intended('/');
    }

    /**
     * Validate that provider is supported
     */
    protected function validateProvider(string $provider): void
    {
        if (!in_array($provider, $this->providers)) {
            abort(404, 'Provider not supported');
        }
    }
}
