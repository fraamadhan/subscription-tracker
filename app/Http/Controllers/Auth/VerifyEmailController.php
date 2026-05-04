<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\OtpVerificationRequest;
use App\Services\OtpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's identifier as verified.
     */
    public function __invoke(OtpVerificationRequest $request, OtpService $otpService): RedirectResponse
    {
        $user = Auth::user();
        $input = $request->validated();
        $identifier = $user->email ?? $user->phone_number;

        if ($user->hasVerifiedEmail() || $user->phone_verified_at) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        if ($otpService->validateOtp($identifier, $input['otp'], 'verification')) {
            if ($user->email) {
                $user->email_verified_at = now();
            } else {
                $user->phone_verified_at = now();
            }
            $user->save();

            return redirect()->intended(route('dashboard', absolute: false). '?verified=1');
        }

        return back()->withErrors(['otp' => 'Invalid or expired OTP.']);
    }
}
