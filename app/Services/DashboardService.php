<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getMetrics(User $user, $period = 'monthly', $year = null, $month = null, $startDate = null, $endDate = null)
    {
        $year = $year ?: now()->year;
        $month = $month ?: now()->month;

        $subscriptions = $user->subscriptions()->where('is_active', true)->get();
        
        $rates = [
            'IDR' => 1,
            'USD' => 16200,
            'GBP' => 20500,
        ];

        // Actual spending from billing history
        $historyQuery = $user->billingHistories();

        if ($period === 'monthly') {
            $historyQuery->whereYear('paid_at', $year)->whereMonth('paid_at', $month);
        } elseif ($period === 'yearly') {
            $historyQuery->whereYear('paid_at', $year);
        } elseif ($period === 'custom' && $startDate && $endDate) {
            $historyQuery->whereBetween('paid_at', [$startDate, $endDate]);
        }

        $actualSpendIdr = $historyQuery->get()->reduce(function ($sum, $history) use ($rates) {
            return $sum + ($history->amount * ($rates[$history->currency] ?? 1));
        }, 0);

        // Projection for annual spend and FX exposure
        $totalMonthlyIdr = 0;
        $fxExposureCount = 0;
        foreach ($subscriptions as $sub) {
            $priceInIdr = $sub->price * ($rates[$sub->currency] ?? 1);
            $monthlyPrice = match($sub->billing_cycle) {
                'daily' => $priceInIdr * 30,
                'weekly' => $priceInIdr * 4,
                'monthly' => $priceInIdr,
                'yearly' => $priceInIdr / 12,
                default => $priceInIdr
            };
            $totalMonthlyIdr += $monthlyPrice;
            if ($sub->currency !== 'IDR') $fxExposureCount++;
        }

        // For "Total Spend" metric, we use the actual history
        $displayTotal = $actualSpendIdr;
        
        // Reminder coverage: subs with next billing date in the future
        $totalSubs = $subscriptions->count();
        $coveredSubs = $subscriptions->where('next_billing_date', '>', now())->count();
        $reminderCoverage = $totalSubs > 0 ? round(($coveredSubs / $totalSubs) * 100) : 0;

        // Due soon (next 7 days)
        $dueSoon = $subscriptions->whereBetween('next_billing_date', [now(), now()->addDays(7)])->count();
        $dueSoonList = $subscriptions->whereBetween('next_billing_date', [now(), now()->addDays(7)])
            ->take(2)
            ->pluck('name')
            ->toArray();

        // Spending trend (last 6 months or custom range)
        $query = $user->billingHistories()
            ->select(
                DB::raw("to_char(paid_at, 'YYYY-MM') as month"),
                DB::raw("sum(amount * (CASE 
                    WHEN currency = 'USD' THEN 16200 
                    WHEN currency = 'GBP' THEN 20500 
                    ELSE 1 
                END)) as total")
            );

        if ($startDate && $endDate) {
            $query->whereBetween('paid_at', [$startDate, $endDate]);
        } else {
            $query->where('paid_at', '>=', now()->subMonths(6)->startOfMonth());
        }

        $historyTrend = $query->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function($item) {
                return [
                    'month' => Carbon::parse($item->month)->format('M'),
                    'total' => (float) $item->total
                ];
            });

        return [
            'total_spend' => $displayTotal,
            'active_subs_count' => $totalSubs,
            'due_soon_count' => $dueSoon,
            'due_soon_services' => $dueSoonList,
            'payment_methods_count' => $user->paymentMethods()->count(),
            'reminder_coverage' => $reminderCoverage,
            'covered_plans_count' => $coveredSubs,
            'fx_exposure_count' => $fxExposureCount,
            'spending_trend' => $historyTrend,
            'estimated_annual_spend' => $totalMonthlyIdr * 12,
        ];
    }
}
