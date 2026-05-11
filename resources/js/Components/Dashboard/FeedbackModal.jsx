import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { MessageSquare, X } from 'lucide-react';

export default function FeedbackModal({ show, onClose }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        message: '',
    });

    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('feedbacks.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsSuccess(true);
                reset();
                setTimeout(() => {
                    setIsSuccess(false);
                    onClose();
                }, 2000);
            },
        });
    };

    const handleClose = () => {
        reset();
        clearErrors();
        setIsSuccess(false);
        onClose();
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="md">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 md:px-8 md:pt-8 border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500">
                        <MessageSquare className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        Send Feedback
                    </h2>
                </div>
                <button
                    onClick={handleClose}
                    className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <div className="p-6 md:p-8">
                {isSuccess ? (
                    <div className="text-center py-6">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/20 mb-4">
                            <svg className="h-6 w-6 text-green-600 dark:text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">Thank you!</h3>
                        <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">Your feedback has been submitted successfully.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="message" value="What's on your mind?" className="text-slate-700 dark:text-gray-300" />
                            <textarea
                                id="message"
                                name="message"
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                rows={4}
                                className="mt-1 block w-full rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-warm-dark-card text-slate-950 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                                placeholder="I wish there was a feature to..."
                                required
                            />
                            <InputError message={errors.message} className="mt-2" />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
                            <SecondaryButton onClick={handleClose}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton disabled={processing} className="rounded-2xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700">
                                Submit
                            </PrimaryButton>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    );
}
