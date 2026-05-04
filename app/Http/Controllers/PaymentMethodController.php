<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentMethodController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Auth::user()->paymentMethods()->create($validated);

        return redirect()->back()->with('success', 'Payment method added successfully.');
    }

    public function update(Request $request, PaymentMethod $paymentMethod)
    {
        if ($paymentMethod->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $paymentMethod->update($validated);

        return redirect()->back()->with('success', 'Payment method updated successfully.');
    }

    public function destroy(PaymentMethod $paymentMethod)
    {
        if ($paymentMethod->user_id !== Auth::id()) {
            abort(403);
        }

        // Check if it's being used by any subscription
        if ($paymentMethod->subscriptions()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete payment method that is in use.');
        }

        $paymentMethod->delete();

        return redirect()->back()->with('success', 'Payment method deleted successfully.');
    }
}
