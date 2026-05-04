<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your SubTracker OTP Code</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f0f0;font-family:'Arial Black',Impact,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:40px 0;">
    <tr>
        <td align="center">
            <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;">

                {{-- ===== HEADER / LOGO BLOCK ===== --}}
                <tr>
                    <td>
                        {{-- Neo-brutalism offset shadow --}}
                        <div style="position:relative;display:block;">
                            {{-- Shadow layer --}}
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background:#000000;height:6px;"></td>
                                </tr>
                            </table>
                            {{-- Logo Banner --}}
                            <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFE500;border:4px solid #000000;border-bottom:none;">
                                <tr>
                                    <td style="padding:24px 32px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="vertical-align:middle;">
                                                    {{-- Inline SVG Logo Icon --}}
                                                    <table cellpadding="0" cellspacing="0" style="display:inline-table;vertical-align:middle;">
                                                        <tr>
                                                            <td style="padding-right:16px;">
                                                                <svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
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
                                                    <span style="display:inline-block;background:#000000;color:#FFE500;font-family:'Arial Black',Arial,sans-serif;font-size:10px;font-weight:900;letter-spacing:2px;text-transform:uppercase;padding:6px 12px;border:2px solid #000000;">SECURE CODE</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>

                {{-- ===== BODY BLOCK ===== --}}
                <tr>
                    <td style="background:#ffffff;border:4px solid #000000;border-top:none;border-bottom:none;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="padding:36px 36px 28px;">

                                    {{-- Purpose Label --}}
                                    <table cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="background:#000000;padding:6px 14px;">
                                                <p style="margin:0;font-family:'Arial Black',Arial,sans-serif;font-size:11px;font-weight:900;color:#FFE500;letter-spacing:3px;text-transform:uppercase;">{{ strtoupper($purposeLabel) }}</p>
                                            </td>
                                        </tr>
                                    </table>

                                    {{-- Heading --}}
                                    <h1 style="margin:16px 0 8px;font-family:'Arial Black',Impact,Arial,sans-serif;font-size:26px;font-weight:900;color:#000000;letter-spacing:-0.5px;line-height:1.2;">Your One-Time<br/>Password is Ready</h1>

                                    {{-- Description --}}
                                    <p style="margin:0 0 28px;font-family:Arial,sans-serif;font-size:14px;color:#333333;line-height:1.7;">
                                        Enter the code below to complete your <strong>{{ strtolower($purposeLabel) }}</strong>.<br/>
                                        This code is valid for <strong>10 minutes</strong> only.
                                    </p>

                                    {{-- ===== OTP CODE BOX (Neo-brutalism) ===== --}}
                                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                        <tr>
                                            {{-- Shadow offset --}}
                                            <td>
                                                <table width="100%" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        {{-- The actual OTP box --}}
                                                        <td style="background:#FFE500;border:4px solid #000000;padding:28px 20px;text-align:center;box-shadow:6px 6px 0 #000000;">
                                                            <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#000000;letter-spacing:4px;text-transform:uppercase;">YOUR OTP CODE</p>
                                                            <p style="margin:0;font-family:'Arial Black',Impact,Arial,sans-serif;font-size:52px;font-weight:900;letter-spacing:10px;color:#000000;line-height:1;">{{ $otp }}</p>
                                                            <table cellpadding="0" cellspacing="0" align="center" style="margin-top:10px;">
                                                                <tr>
                                                                    <td style="background:#000000;padding:4px 10px;">
                                                                        <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#FFE500;letter-spacing:2px;">EXPIRES IN 10 MINUTES</p>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    {{-- Bottom shadow bar --}}
                                                    <tr>
                                                        <td style="background:#000000;height:6px;width:calc(100% - 6px);margin-left:6px;"></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>

                                    {{-- Warning Strip --}}
                                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                                        <tr>
                                            <td style="background:#000000;padding:12px 16px;">
                                                <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#FFE500;line-height:1.5;">
                                                    &#9888; NEVER share this code — SubTracker staff will <u>never</u> ask for your OTP.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>

                                    {{-- Ignore Notice --}}
                                    <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#666666;line-height:1.6;border-left:4px solid #FFE500;padding-left:12px;">
                                        If you did not request this code, you can safely ignore this email. No action is required.
                                    </p>

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
                                        Automated message — please do not reply to this email.
                                    </p>
                                </td>
                                <td align="right">
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

                {{-- Bottom shadow of entire card --}}
                <tr>
                    <td style="background:#000000;height:8px;margin-left:8px;"></td>
                </tr>

            </table>
        </td>
    </tr>
</table>

</body>
</html>
