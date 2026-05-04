<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Services\DashboardService;

class DashboardController extends Controller
{
    protected $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $period = $request->query('period', 'monthly');
        $year = $request->query('year', now()->year);
        $month = $request->query('month', now()->month);
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        // Ensure user has some default categories if none exist
        if ($user->categories()->count() === 0) {
            $user->categories()->createMany([
                ['name' => 'Entertainment', 'color_hex' => '#ef4444'],
                ['name' => 'Software', 'color_hex' => '#3b82f6'],
                ['name' => 'Utilities', 'color_hex' => '#10b981'],
                ['name' => 'Design', 'color_hex' => '#06b6d4'],
            ]);
        }

        // Ensure user has some default payment methods if none exist
        if ($user->paymentMethods()->count() === 0) {
            $user->paymentMethods()->createMany([
                ['name' => 'BCA Visa'],
                ['name' => 'GoPay'],
                ['name' => 'Jago Virtual Card'],
            ]);
        }

        return Inertia::render('Dashboard', [
            'filters' => [
                'period' => $period,
                'year' => $year,
                'month' => $month,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'metrics' => $this->dashboardService->getMetrics($user, $period, $year, $month, $startDate, $endDate),
            'subscriptions' => $user->subscriptions()
                ->with(['category', 'paymentMethod'])
                ->latest()
                ->get()
                ->map(function ($sub) {
                    return [
                        'id' => $sub->id,
                        'name' => $sub->name,
                        'price' => (float) $sub->price,
                        'currency' => $sub->currency,
                        'cycle' => $sub->billing_cycle,
                        'nextBilling' => $sub->next_billing_date->format('Y-m-d'),
                        'category' => $sub->category ? $sub->category->name : 'Unassigned',
                        'categoryId' => $sub->category_id,
                        'paymentMethod' => $sub->paymentMethod ? $sub->paymentMethod->name : 'Unassigned',
                        'paymentMethodId' => $sub->payment_method_id,
                        'note' => $sub->note,
                        'color' => $sub->color_hex ?: '#f59e0b',
                    ];
                }),
            'categories' => $user->categories()->withCount('subscriptions')->get(),
            'paymentMethods' => $user->paymentMethods()->withCount('subscriptions')->get(),
            'billingHistory' => $user->billingHistories()
                ->with('subscription')
                ->latest()
                ->paginate(5)
                ->through(function ($history) {
                    return [
                        'id' => $history->id,
                        'service' => $history->subscription->name,
                        'date' => $history->paid_at->format('d M Y'),
                        'amount' => $history->currency . ' ' . number_format($history->amount, 0, ',', '.'),
                        'detail' => 'Paid manually via dashboard',
                        'status' => $history->status,
                    ];
                }),
        ]);
    }
}
