<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Subscription;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class CheckRenewals extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-renewals';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for overdue and upcoming subscriptions and send email reminders via SMTP';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            $today = Carbon::today();
            $currentTime = Carbon::now()->format('H:i');

            Log::info("[CheckRenewals] CRON JOB STARTED.");
            Log::info("[CheckRenewals] Current Server Time: " . Carbon::now()->toDateTimeString());
            Log::info("[CheckRenewals] Checking for notify_time <= {$currentTime}");

            // 1. Overdue Subscriptions (past next_billing_date)
            $overdue = Subscription::with(['user', 'category', 'paymentMethod'])
                ->where('next_billing_date', '<', $today)
                ->where('is_active', true)
                ->where(function ($query) use ($today, $currentTime) {
                    $query->where('notify_time', '<=', $currentTime . ':59')
                          ->where(function ($q) use ($today) {
                              $q->whereNull('last_notified_at')
                                ->orWhere('last_notified_at', '<', $today);
                          });
                })
                ->get();

            Log::info("[CheckRenewals] Found {$overdue->count()} OVERDUE subscriptions matching criteria.");

            foreach ($overdue as $sub) {
                $this->info("Subscription OVERDUE: {$sub->name} (Due: {$sub->next_billing_date})");
                $this->sendReminderEmail($sub, 'overdue');
            }

            // 2. Upcoming Renewals (H-1 to H-3)
            $upcoming = Subscription::with(['user', 'category', 'paymentMethod'])
                ->whereBetween('next_billing_date', [
                    $today->copy()->addDay(),
                    $today->copy()->addDays(3)
                ])
                ->where('is_active', true)
                ->where(function ($query) use ($today, $currentTime) {
                    $query->where('notify_time', '<=', $currentTime . ':59')
                          ->where(function ($q) use ($today) {
                              $q->whereNull('last_notified_at')
                                ->orWhere('last_notified_at', '<', $today);
                          });
                })
                ->get();

            Log::info("[CheckRenewals] Found {$upcoming->count()} UPCOMING subscriptions matching criteria.");

            foreach ($upcoming as $sub) {
                $daysUntil = $today->diffInDays(Carbon::parse($sub->next_billing_date));
                $this->info("Subscription RENEWING IN {$daysUntil} DAYS: {$sub->name}");
                $this->sendReminderEmail($sub, 'upcoming', $daysUntil);
            }

            $this->info('Renewal check completed.');
            Log::info("[CheckRenewals] CRON JOB COMPLETED.");
            
            return 0;
        } catch (\Exception $e) {
            Log::error("[CheckRenewals] FATAL ERROR: " . $e->getMessage());
            Log::error($e->getTraceAsString());
            $this->error("Fatal Error: " . $e->getMessage());
            return 1;
        }
    }

    /**
     * Send a reminder email to the subscription owner.
     *
     * @param  \App\Models\Subscription  $subscription
     * @param  string  $type  'overdue' or 'upcoming'
     */
    private function sendReminderEmail(Subscription $subscription, string $type, int $daysUntil = 0): void
    {
        $user = $subscription->user;

        if (!$user || !$user->email) {
            $this->warn("Skipping reminder for subscription [{$subscription->name}]: no user email.");
            return;
        }

        $subject = $type === 'overdue'
            ? "[SubTracker] ⚠️ Payment Overdue: {$subscription->name}"
            : "[SubTracker] 🔔 Renewal Reminder: {$subscription->name} renews " . ($daysUntil === 1 ? 'tomorrow' : "in {$daysUntil} days");

        try {
            $body = view('emails.reminder', [
                'subscription' => $subscription,
                'userName'     => $user->name,
                'type'         => $type,
                'daysUntil'    => $daysUntil,
            ])->render();

            Mail::html($body, function ($message) use ($user, $subject) {
                $message->to($user->email, $user->name)->subject($subject);
            });

            Log::info("[CheckRenewals] Reminder sent to {$user->email} for subscription [{$subscription->name}] (type: {$type})");
            $this->info("  → Email sent to {$user->email}");
            
            $subscription->update(['last_notified_at' => Carbon::today()]);
        } catch (\Exception $e) {
            Log::error("[CheckRenewals] Failed to send reminder for [{$subscription->name}]: " . $e->getMessage());
            $this->error("  → Failed to send email to {$user->email}: " . $e->getMessage());
        }
    }
}
