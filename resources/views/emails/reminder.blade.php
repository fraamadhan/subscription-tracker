<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Subscription Renewal Reminder — SubTracker</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f0f0;font-family:'Arial Black',Impact,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:40px 0;">
    <tr>
        <td align="center">
            <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;">

                {{-- ===== HEADER / LOGO BLOCK ===== --}}
                <tr>
                    <td>
                        <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFE500;border:4px solid #000000;border-bottom:none;">
                            <tr>
                                <td style="padding:24px 32px;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="vertical-align:middle;">
                                                <table cellpadding="0" cellspacing="0" style="display:inline-table;vertical-align:middle;">
                                                    <tr>
                                                        <td style="padding-right:16px;">
                                                            <svg width="52" height="52" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                                                                <circle cx="20" cy="28" r="18" fill="#FFE500" stroke="#000" stroke-width="3.5"/>
                                                                <circle cx="20" cy="28" r="8" fill="#000"/>
                                                                <circle cx="20" cy="28" r="3.5" fill="#FFE500"/>
                                                                <circle cx="36" cy="18" r="13" fill="#fff" stroke="#000" stroke-width="3.5"/>
                                                                <circle cx="36" cy="18" r="5" fill="#000"/>
                                                                <circle cx="47" cy="38" r="10" fill="#000" stroke="#000" stroke-width="3.5"/>
                                                                <circle cx="47" cy="38" r="4" fill="#FFE500"/>
                                                            </svg>
                                                        </td>
                                                        <td style="vertical-align:middle;">
                                                            <p style="margin:0;font-family:'Arial Black',Impact,Arial,sans-serif;font-size:28px;font-weight:900;color:#000000;letter-spacing:-1px;line-height:1;">SUBTRACKER</p>
                                                            <p style="margin:3px 0 0;font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#000000;letter-spacing:3px;text-transform:uppercase;">Subscription Management</p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                            <td align="right" style="vertical-align:middle;">
                                                @if($type === 'overdue')
                                                    <span style="display:inline-block;background:#ff2d55;color:#ffffff;font-family:'Arial Black',Arial,sans-serif;font-size:10px;font-weight:900;letter-spacing:2px;text-transform:uppercase;padding:6px 12px;border:2px solid #000000;">OVERDUE</span>
                                                @else
                                                    <span style="display:inline-block;background:#000000;color:#FFE500;font-family:'Arial Black',Arial,sans-serif;font-size:10px;font-weight:900;letter-spacing:2px;text-transform:uppercase;padding:6px 12px;border:2px solid #000000;">REMINDER</span>
                                                @endif
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                {{-- ===== ALERT BANNER ===== --}}
                <tr>
                    <td>
                        @if($type === 'overdue')
                            <table width="100%" cellpadding="0" cellspacing="0" style="background:#ff2d55;border:4px solid #000000;border-top:none;border-bottom:none;">
                                <tr>
                                    <td style="padding:12px 32px;">
                                        <p style="margin:0;font-family:'Arial Black',Arial,sans-serif;font-size:13px;font-weight:900;color:#ffffff;letter-spacing:1px;text-transform:uppercase;">
                                            &#9888; PAYMENT OVERDUE — ACTION REQUIRED
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        @else
                            <table width="100%" cellpadding="0" cellspacing="0" style="background:#000000;border:4px solid #000000;border-top:none;border-bottom:none;">
                                <tr>
                                    <td style="padding:12px 32px;">
                                        <p style="margin:0;font-family:'Arial Black',Arial,sans-serif;font-size:13px;font-weight:900;color:#FFE500;letter-spacing:1px;text-transform:uppercase;">
                                            &#128276; RENEWAL REMINDER — DUE {{ isset($daysUntil) && $daysUntil > 1 ? "IN {$daysUntil} DAYS" : 'TOMORROW' }}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        @endif
                    </td>
                </tr>

                {{-- ===== BODY BLOCK ===== --}}
                <tr>
                    <td style="background:#ffffff;border:4px solid #000000;border-top:none;border-bottom:none;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="padding:32px 36px 28px;">

                                    {{-- Greeting --}}
                                    <h1 style="margin:0 0 6px;font-family:'Arial Black',Impact,Arial,sans-serif;font-size:24px;font-weight:900;color:#000000;line-height:1.2;">
                                        Hey {{ $userName }},
                                    </h1>
                                    <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:14px;color:#333333;line-height:1.7;">
                                        @if($type === 'overdue')
                                            One of your subscriptions is <strong>past its billing date</strong> and needs your attention.
                                        @else
                                            One of your subscriptions is <strong>renewing {{ isset($daysUntil) && $daysUntil > 1 ? "in {$daysUntil} days" : 'tomorrow' }}</strong>. Make sure your payment is ready.
                                        @endif
                                    </p>

                                    {{-- ===== SUBSCRIPTION CARD (Neo-brutalism) ===== --}}
                                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                                        <tr>
                                            <td>
                                                <table width="100%" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        {{-- Color accent stripe --}}
                                                        <td width="8" style="background:{{ $subscription->color_hex ?? '#000000' }};border:3px solid #000000;border-right:none;"></td>
                                                        {{-- Card body --}}
                                                        <td style="background:#f9f9f9;border:3px solid #000000;padding:20px 20px 20px 16px;">
                                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                                <tr>
                                                                    <td>
                                                                        <p style="margin:0 0 4px;font-family:'Arial Black',Arial,sans-serif;font-size:18px;font-weight:900;color:#000000;letter-spacing:-0.3px;">{{ $subscription->name }}</p>
                                                                        <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#666666;text-transform:uppercase;letter-spacing:1px;">
                                                                            {{ $subscription->category?->name ?? 'General' }} &bull; {{ ucfirst($subscription->billing_cycle) }}
                                                                        </p>
                                                                    </td>
                                                                    <td align="right" style="vertical-align:top;">
                                                                        <p style="margin:0;font-family:'Arial Black',Arial,sans-serif;font-size:22px;font-weight:900;color:#000000;">
                                                                            {{ $subscription->currency }} {{ number_format($subscription->price, 2) }}
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td colspan="2" style="padding-top:14px;">
                                                                        <table cellpadding="0" cellspacing="0">
                                                                            <tr>
                                                                                @if($type === 'overdue')
                                                                                    <td style="background:#ff2d55;border:2px solid #000000;padding:5px 12px;">
                                                                                        <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#ffffff;letter-spacing:1px;text-transform:uppercase;">
                                                                                            WAS DUE: {{ \Carbon\Carbon::parse($subscription->next_billing_date)->format('D, d M Y') }}
                                                                                        </p>
                                                                                    </td>
                                                                                @else
                                                                                    <td style="background:#FFE500;border:2px solid #000000;padding:5px 12px;">
                                                                                        <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#000000;letter-spacing:1px;text-transform:uppercase;">
                                                                                            DUE: {{ \Carbon\Carbon::parse($subscription->next_billing_date)->format('D, d M Y') }}
                                                                                        </p>
                                                                                    </td>
                                                                                @endif
                                                                                @if($subscription->paymentMethod)
                                                                                    <td width="8"></td>
                                                                                    <td style="background:#000000;border:2px solid #000000;padding:5px 12px;">
                                                                                        <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#FFE500;letter-spacing:1px;text-transform:uppercase;">
                                                                                            {{ $subscription->paymentMethod->name }}
                                                                                        </p>
                                                                                    </td>
                                                                                @endif
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    {{-- Shadow bar --}}
                                                    <tr>
                                                        <td style="background:#000000;height:5px;" colspan="2"></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>

                                    {{-- Action note --}}
                                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                                        <tr>
                                            <td style="background:#FFE500;border:3px solid #000000;padding:14px 16px;">
                                                <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#000000;line-height:1.6;font-weight:700;">
                                                    @if($type === 'overdue')
                                                        &#128680; Log in to SubTracker and update your subscription status or renew your payment immediately.
                                                    @else
                                                        &#128161; Make sure your payment method is ready. Log in to SubTracker to review or cancel before it renews.
                                                    @endif
                                                </p>
                                            </td>
                                        </tr>
                                    </table>

                                    {{-- Note if exists --}}
                                    @if($subscription->note)
                                        <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#888888;line-height:1.6;border-left:4px solid #000000;padding-left:12px;font-style:italic;">
                                            Your note: {{ $subscription->note }}
                                        </p>
                                    @endif

                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                {{-- ===== FOOTER BLOCK ===== --}}
                <tr>
                    <td style="background:#000000;border:4px solid #000000;border-top:none;padding:18px 36px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td>
                                    <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#FFE500;font-weight:700;letter-spacing:1px;">
                                        &copy; {{ date('Y') }} SUBTRACKER
                                    </p>
                                    <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:10px;color:rgba(255,229,0,0.5);">
                                        You are receiving this because you have an active subscription in SubTracker.
                                    </p>
                                </td>
                                <td align="right" style="vertical-align:middle;">
                                    <svg width="28" height="28" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="20" cy="28" r="18" fill="#FFE500" stroke="#FFE500" stroke-width="3"/>
                                        <circle cx="20" cy="28" r="8" fill="#000"/>
                                        <circle cx="20" cy="28" r="3.5" fill="#FFE500"/>
                                        <circle cx="36" cy="18" r="13" fill="none" stroke="#FFE500" stroke-width="3"/>
                                        <circle cx="36" cy="18" r="5" fill="#FFE500"/>
                                        <circle cx="47" cy="38" r="10" fill="#FFE500" stroke="#FFE500" stroke-width="3"/>
                                        <circle cx="47" cy="38" r="4" fill="#000"/>
                                    </svg>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                {{-- Bottom shadow --}}
                <tr>
                    <td style="background:#000000;height:8px;"></td>
                </tr>

            </table>
        </td>
    </tr>
</table>

</body>
</html>
