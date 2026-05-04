<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PaymentMethodController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/subscriptions', [SubscriptionController::class, 'store'])->name('subscriptions.store');
    Route::post('/subscriptions/{subscription}/mark-as-paid', [SubscriptionController::class, 'markAsPaid'])->name('subscriptions.mark-as-paid');
    Route::put('/subscriptions/{subscription}', [SubscriptionController::class, 'update'])->name('subscriptions.update');
    Route::delete('/subscriptions/{subscription}', [SubscriptionController::class, 'destroy'])->name('subscriptions.destroy');

    // Category Routes
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    // Payment Method Routes
    Route::post('/payment-methods', [PaymentMethodController::class, 'store'])->name('payment_methods.store');
    Route::put('/payment-methods/{paymentMethod}', [PaymentMethodController::class, 'update'])->name('payment_methods.update');
    Route::delete('/payment-methods/{paymentMethod}', [PaymentMethodController::class, 'destroy'])->name('payment_methods.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

// ─── Local-only email preview routes ───────────────────────────────────────
if (app()->environment('local')) {
    Route::prefix('preview/email')->name('preview.email.')->group(function () {

        Route::get('/otp', function () {
            return view('emails.otp', [
                'otp'          => '847291',
                'purposeLabel' => 'Account Verification',
            ]);
        })->name('otp');

        Route::get('/otp-reset', function () {
            return view('emails.otp', [
                'otp'          => '314159',
                'purposeLabel' => 'Password Reset',
            ]);
        })->name('otp-reset');

        Route::get('/reminder-upcoming', function () {
            $fakeSubscription = new \App\Models\Subscription([
                'name'              => 'Netflix Premium',
                'price'             => 159000,
                'currency'          => 'IDR',
                'billing_cycle'     => 'monthly',
                'next_billing_date' => now()->addDay(),
                'color_hex'         => '#E50914',
                'note'              => 'Family plan — shared with 3 members.',
            ]);
            $fakeSubscription->setRelation('category', (object)['name' => 'Entertainment']);
            $fakeSubscription->setRelation('paymentMethod', (object)['name' => 'BCA Credit Card']);

            return view('emails.reminder', [
                'subscription' => $fakeSubscription,
                'userName'     => 'Fraamadhan',
                'type'         => 'upcoming',
            ]);
        })->name('reminder-upcoming');

        Route::get('/reminder-overdue', function () {
            $fakeSubscription = new \App\Models\Subscription([
                'name'              => 'Spotify Family',
                'price'             => 79000,
                'currency'          => 'IDR',
                'billing_cycle'     => 'monthly',
                'next_billing_date' => now()->subDays(3),
                'color_hex'         => '#1DB954',
                'note'              => null,
            ]);
            $fakeSubscription->setRelation('category', (object)['name' => 'Music']);
            $fakeSubscription->setRelation('paymentMethod', (object)['name' => 'GoPay']);

            return view('emails.reminder', [
                'subscription' => $fakeSubscription,
                'userName'     => 'Fraamadhan',
                'type'         => 'overdue',
            ]);
        })->name('reminder-overdue');

    });
}

