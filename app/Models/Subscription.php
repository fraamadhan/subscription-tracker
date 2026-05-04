<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Subscription extends Model
{
    protected $fillable = [
        'user_id',
        'category_id',
        'payment_method_id',
        'name',
        'price',
        'currency',
        'billing_cycle',
        'next_billing_date',
        'is_active',
        'note',
        'color_hex',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'next_billing_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function billingHistories(): HasMany
    {
        return $this->hasMany(BillingHistory::class);
    }

    public function getNextBillingDate(): Carbon
    {
        $date = Carbon::parse($this->next_billing_date);

        switch ($this->billing_cycle) {
            case 'daily':
                return $date->addDay();
            case 'weekly':
                return $date->addWeek();
            case 'yearly':
                return $date->addYear();
            case 'monthly':
            default:
                return $date->addMonth();
        }
    }
}
