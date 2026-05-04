import { CheckCircle2, Clock3, CircleAlert } from 'lucide-react';

const statusMap = {
    success: {
        icon: CheckCircle2,
        chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
        label: 'Paid',
    },
    upcoming: {
        icon: Clock3,
        chip: 'bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
        label: 'Upcoming',
    },
    failed: {
        icon: CircleAlert,
        chip: 'bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
        label: 'Needs review',
    },
};

export default function BillingActivityItem({ item }) {
    const { icon: Icon, chip, label } = statusMap[item.status];

    return (
        <li className="flex items-start gap-4 rounded-3xl border border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-warm-dark/40 p-4">
            <span className={`mt-1 flex h-10 w-10 items-center justify-center rounded-2xl ${chip}`}>
                <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="font-semibold text-slate-950 dark:text-white">{item.service}</p>
                        <p className="text-sm text-slate-500 dark:text-gray-400">{item.date}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${chip}`}>
                        {label}
                    </span>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-gray-400">
                    {item.amount} • {item.detail}
                </p>
            </div>
        </li>
    );
}
