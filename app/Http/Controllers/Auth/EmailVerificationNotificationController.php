<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\OtpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Resend the OTP notification.
     */
    public function store(Request $request, OtpService $otpService): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail() || $user->phone_verified_at) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        $identifier = $user->email ?? $user->phone_number;
        $otpService->generateOtp($identifier, 'verification');

        return back()->with('status', 'verification-link-sent');
    }
}
