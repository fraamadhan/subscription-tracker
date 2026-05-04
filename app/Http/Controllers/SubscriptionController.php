<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use App\Models\BillingHistory;

class SubscriptionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'currency' => 'required|string|max:3',
            'billing_cycle' => 'required|string',
            'next_billing_date' => 'required|date',
            'category_id' => 'nullable|exists:categories,id',
            'payment_method_id' => 'nullable|exists:payment_methods,id',
            'note' => 'nullable|string',
            'color_hex' => 'nullable|string|max:7',
        ]);

        Auth::user()->subscriptions()->create($validated);

        return redirect()->back()->with('success', 'Subscription added successfully.');
    }

    public function update(Request $request, Subscription $subscription)
    {
        Gate::authorize('update', $subscription);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'currency' => 'required|string|max:3',
            'billing_cycle' => 'required|string',
            'next_billing_date' => 'required|date',
            'category_id' => 'nullable|exists:categories,id',
            'payment_method_id' => 'nullable|exists:payment_methods,id',
            'note' => 'nullable|string',
            'color_hex' => 'nullable|string|max:7',
        ]);

        $subscription->update($validated);

        return redirect()->back()->with('success', 'Subscription updated successfully.');
    }

    public function destroy(Subscription $subscription)
    {
        Gate::authorize('delete', $subscription);

        $subscription->delete();

        return redirect()->back()->with('success', 'Subscription deleted successfully.');
    }

    public function markAsPaid(Subscription $subscription)
    {
        Gate::authorize('update', $subscription);

        DB::transaction(function () use ($subscription) {
            // Create billing history record
            $subscription->billingHistories()->create([
                'user_id' => auth()->id(),
                'amount' => $subscription->price,
                'currency' => $subscription->currency,
                'billing_date' => $subscription->next_billing_date,
                'paid_at' => now(),
                'status' => 'success',
            ]);

            // Update next billing date
            $subscription->update([
                'next_billing_date' => $subscription->getNextBillingDate(),
            ]);
        });

        return redirect()->back()->with('success', 'Subscription marked as paid!');
    }
}
