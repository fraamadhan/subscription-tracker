<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\Auth\RegistrationRequest;
use App\Services\OtpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(RegistrationRequest $request, OtpService $otpService): RedirectResponse
    {
        $input = $request->validated();
        $identifier = $input['email'];
        
        $isEmail = filter_var($identifier, FILTER_VALIDATE_EMAIL) !== false;
        
        // Manual unique checking since we accept both email and phone dynamically
        if ($isEmail && User::where('email', $identifier)->exists()) {
             return back()->withErrors(['email' => 'This email is already taken.']);
        } elseif (!$isEmail && User::where('phone_number', $identifier)->exists()) {
             return back()->withErrors(['email' => 'This phone number is already taken.']);
        }

        $user = User::create([
            'name' => $input['name'],
            'email' => $isEmail ? $identifier : null,
            'phone_number' => !$isEmail ? $identifier : null,
            'password' => Hash::make($input['password']),
        ]);

        $otpService->generateOtp($identifier, 'verification');

        Auth::login($user);

        return redirect()->route('verification.notice');
    }
}
