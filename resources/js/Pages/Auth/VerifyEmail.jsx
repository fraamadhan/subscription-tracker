import PrimaryButton from '@/Components/PrimaryButton';
import AuthLayout from '@/Layouts/AuthLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { auth } = usePage().props;
    const identifier = auth?.user?.email ?? auth?.user?.phone_number ?? 'your registered contact';

    const { data, setData, post, processing, errors } = useForm({
        otp: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.verify'));
    };

    const resendOtp = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <AuthLayout title="Verify Account">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Verify Your Account</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    A 6-digit OTP code was sent to <span className="font-semibold text-gray-800 dark:text-gray-200">{identifier}</span>. Enter it below to activate your account.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-4 py-3 rounded-xl border border-green-200 dark:border-green-800 text-center">
                    A new OTP has been sent to <strong>{identifier}</strong>.
                </div>
            )}

            <form onSubmit={submit} className="space-y-6 flex flex-col items-center">
                <div className="w-full">
                    <InputLabel htmlFor="otp" value="Enter 6-Digit OTP" className="text-center w-full block mb-2" />
                    <TextInput
                        id="otp"
                        type="text"
                        name="otp"
                        value={data.otp}
                        className="mt-1 block w-2/3 mx-auto text-center text-2xl tracking-[0.5em] font-medium"
                        maxLength="6"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        isFocused={true}
                        onChange={(e) => setData('otp', e.target.value.replace(/\D/g, ''))}
                        placeholder="• • • • • •"
                    />
                    <InputError message={errors.otp} className="mt-2 text-center" />
                </div>

                <div className="w-full mt-4 flex items-center justify-between">
                    <button
                        onClick={resendOtp}
                        className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                        disabled={processing}
                        type="button"
                    >
                        Resend OTP
                    </button>

                    <PrimaryButton disabled={processing} className="px-8">
                        Verify Account
                    </PrimaryButton>
                </div>

                <div className="w-full text-center mt-4 border-t border-gray-200 dark:border-white/10 pt-4">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                        Sign out and use a different account
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
