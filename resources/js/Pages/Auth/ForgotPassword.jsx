import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        identifier: '', // changed from email to identifier (for email/whatsapp)
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <AuthLayout title="Forgot Password">
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Forgot Password</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Forgot your password? No problem. Just let us know your email address or WhatsApp number and we will send you a password reset OTP.
                </p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 px-4 py-3 rounded-xl border border-green-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="identifier" value="Email or WhatsApp" />

                    <TextInput
                        id="identifier"
                        type="text"
                        name="identifier"
                        value={data.identifier}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('identifier', e.target.value)}
                    />

                    <InputError message={errors.identifier} className="mt-2" />
                </div>

                <div className="flex items-center justify-between mt-4">
                    <Link
                        href={route('login')}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                    >
                        Back to log in
                    </Link>

                    <PrimaryButton disabled={processing}>
                        Send OTP
                    </PrimaryButton>
                </div>
            </form>
        </AuthLayout>
    );
}
