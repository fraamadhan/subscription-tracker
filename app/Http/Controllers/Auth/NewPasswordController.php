<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ResetPasswordOtpRequest;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class NewPasswordController extends Controller
{
    /**
     * Display the password reset view.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Auth/ResetPassword', [
            'identifier' => $request->route('identifier'),
        ]);
    }

    /**
     * Handle an incoming new password request.
     */
    public function store(ResetPasswordOtpRequest $request, OtpService $otpService): RedirectResponse
    {
        $input = $request->validated();
        $identifier = $input['identifier'];

        $isValid = $otpService->validateOtp($identifier, $input['otp'], 'password_reset');

        if (!$isValid) {
            return back()->withErrors(['otp' => 'The OTP is invalid or has expired.']);
        }

        $user = User::where('email', $identifier)->orWhere('phone_number', $identifier)->first();

        if (!$user) {
            return back()->withErrors(['identifier' => 'Unable to resolve user target.']);
        }

        $user->forceFill([
            'password' => Hash::make($input['password']),
            'remember_token' => Str::random(60),
        ])->save();

        event(new PasswordReset($user));

        return redirect()->route('login')->with('status', 'Your password has been reset! Please login.');
    }
}
