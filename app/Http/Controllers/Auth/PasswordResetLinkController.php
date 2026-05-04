<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SendResetOtpRequest;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     */
    public function store(SendResetOtpRequest $request, OtpService $otpService): RedirectResponse
    {
        $input = $request->validated();
        $identifier = $input['identifier'];

        $user = User::where('email', $identifier)
            ->orWhere('phone_number', $identifier)
            ->first();

        // Security best practice: Don't leak if user exists or not, always act like it successfully generated
        // But since we are creating an OTP, we only actually generate if user exists.
        if ($user) {
            $otpService->generateOtp($identifier, 'password_reset');
        }

        // Redirect dynamically to the OTP entry page with the identifier loaded
        return redirect()->route('password.reset', ['identifier' => $identifier]);
    }
}
