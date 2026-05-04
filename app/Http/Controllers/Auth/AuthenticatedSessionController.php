<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request, OtpService $otpService): RedirectResponse
    {
        $request->authenticate();

        $user = Auth::user();

        // Check if the user has verified their email or phone
        $isVerified = $user->email_verified_at !== null || $user->phone_verified_at !== null;

        if (!$isVerified) {
            // Regenerate session first (security)
            $request->session()->regenerate();

            // Generate and send a fresh OTP
            $identifier = $user->email ?? $user->phone_number;
            $otpService->generateOtp($identifier, 'verification');

            // Redirect to verification page (user is already logged in)
            return redirect()->route('verification.notice');
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
