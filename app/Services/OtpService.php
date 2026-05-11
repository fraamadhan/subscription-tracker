<?php

namespace App\Services;

use App\Models\OtpCode;
use Carbon\Carbon;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class OtpService
{
    /**
     * Generate a secure 6-digit OTP for a given identifier and purpose.
     */
    public function generateOtp(string $identifier, string $purpose): string
    {
        // Delete existing OTPs for this identifier & purpose to prevent hoarding
        OtpCode::where('identifier', $identifier)
            ->where('purpose', $purpose)
            ->delete();

        $otp = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);

        OtpCode::create([
            'identifier' => $identifier,
            'otp'        => $otp,
            'purpose'    => $purpose,
            'expires_at' => Carbon::now()->addMinutes(10),
        ]);

        $this->deliverOtp($identifier, $otp, $purpose);

        return $otp;
    }

    /**
     * Validate an OTP for a given identifier and purpose.
     * Consumes the OTP if it is valid (prevents replay attacks).
     */
    public function validateOtp(string $identifier, string $otp, string $purpose): bool
    {
        $otpRecord = OtpCode::where('identifier', $identifier)
            ->where('otp', $otp)
            ->where('purpose', $purpose)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if ($otpRecord) {
            $otpRecord->delete();
            return true;
        }

        return false;
    }

    /**
     * Deliver the OTP code via Email or WhatsApp based on the identifier format.
     */
    private function deliverOtp(string $identifier, string $otp, string $purpose): void
    {
        $isEmail = filter_var($identifier, FILTER_VALIDATE_EMAIL) !== false;
        $purposeLabel = $purpose === 'verification' ? 'Account Verification' : 'Password Reset';

        if ($isEmail) {
            $this->sendEmail($identifier, $otp, $purposeLabel);
        } else {
            $this->sendWhatsApp($identifier, $otp, $purposeLabel);
        }
    }

    /**
     * Send OTP via Email using Laravel's Mail facade with SMTP mailer.
     */
    private function sendEmail(string $email, string $otp, string $purposeLabel): void
    {
        $subject = "[SubTracker] Your {$purposeLabel} OTP Code";
        $body = view('emails.otp', [
            'otp' => $otp,
            'purposeLabel' => $purposeLabel,
        ])->render();

        try {
            dispatch(function () use ($email, $subject, $body, $otp, $purposeLabel) {
                \Illuminate\Support\Facades\Mail::html($body, function ($message) use ($email, $subject) {
                    $message->to($email)->subject($subject);
                });

                \Illuminate\Support\Facades\Log::info("OTP Email sent to {$email} [{$purposeLabel}]");
                \Illuminate\Support\Facades\Log::info("[OTP LOG] for {$email}: {$otp}"); 
            })->afterResponse();
        } catch (\Exception $e) {
            Log::error("OTP Email delivery failed for {$email}: " . $e->getMessage());
            Log::info("[DEV FALLBACK] OTP for {$email}: {$otp}");
        }
    }

    /**
     * Send OTP via WhatsApp using Fonnte API.
     * Replace with your preferred provider (Wablas, Twilio, etc.)
     */
    private function sendWhatsApp(string $phone, string $otp, string $purposeLabel): void
    {
        $token = config('services.fonnte.token');

        if (empty($token)) {
            Log::warning("[WhatsApp] FONNTE_TOKEN not configured. OTP for {$phone}: {$otp}");
            return;
        }

        $message = "Your SubTracker {$purposeLabel} code is:\n\n*{$otp}*\n\nThis code expires in 10 minutes. Do not share this code with anyone.";

        try {
            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'Authorization' => $token,
            ])->post('https://api.fonnte.com/send', [
                'target'  => $phone,
                'message' => $message,
            ]);

            if ($response->successful()) {
                Log::info("WhatsApp OTP sent to {$phone} [{$purposeLabel}]");
            } else {
                Log::error("WhatsApp OTP failed for {$phone}: " . $response->body());
                Log::info("[DEV FALLBACK] OTP for {$phone}: {$otp}");
            }
        } catch (\Exception $e) {
            Log::error("WhatsApp delivery exception for {$phone}: " . $e->getMessage());
            Log::info("[DEV FALLBACK] OTP for {$phone}: {$otp}");
        }
    }
}
