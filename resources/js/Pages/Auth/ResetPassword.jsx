import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ identifier }) { // identifier passed instead of token/email
    const { data, setData, post, processing, errors, reset } = useForm({
        identifier: identifier || '',
        otp: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Reset Password">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Set New Password</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Please enter the OTP sent to your device and set your new password.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="identifier" value="Email or WhatsApp Number" />
                    <TextInput
                        id="identifier"
                        type="text"
                        name="identifier"
                        value={data.identifier}
                        className="mt-1 block w-full opacity-60 bg-gray-100"
                        readOnly={!!identifier} // if passed, it's read only
                        onChange={(e) => setData('identifier', e.target.value)}
                    />
                    <InputError message={errors.identifier} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="otp" value="6-Digit OTP Code" />
                    <TextInput
                        id="otp"
                        type="text"
                        name="otp"
                        value={data.otp}
                        className="mt-1 block w-full text-center text-lg tracking-widest"
                        maxLength="6"
                        isFocused={true}
                        onChange={(e) => setData('otp', e.target.value)}
                        placeholder="• • • • • •"
                    />
                    <InputError message={errors.otp} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="New Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center justify-end">
                    <PrimaryButton className="w-full mt-2" disabled={processing}>
                        Reset Password
                    </PrimaryButton>
                </div>
            </form>
        </AuthLayout>
    );
}
