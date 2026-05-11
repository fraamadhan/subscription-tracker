import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { MessageSquare } from 'lucide-react';

export default function Feedbacks({ auth, feedbacks }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                            User Feedbacks
                        </h2>
                        <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
                            See what users are saying about the app.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="User Feedbacks" />

            <div className="mt-6 space-y-4">
                {feedbacks.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 dark:border-white/10 bg-white/50 dark:bg-warm-dark-card/50 px-6 py-12 text-center backdrop-blur">
                        <MessageSquare className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                        <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                            No feedbacks yet
                        </h3>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {feedbacks.data.map((feedback) => (
                            <div key={feedback.id} className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-warm-dark-card p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {feedback.user?.name || 'Deleted User'} <span className="text-xs font-normal text-slate-500">({feedback.user?.email})</span>
                                    </h4>
                                    <span className="text-xs text-slate-400">
                                        {new Date(feedback.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="mt-4 text-sm text-slate-700 dark:text-gray-300 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl">
                                    {feedback.message}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
