import { ArrowUpRight } from 'lucide-react';

export default function MetricCard({
    title,
    value,
    detail,
    tone = 'amber',
    icon: Icon,
}) {
    const tones = {
        amber: 'from-amber-300/25 via-orange-100 dark:via-orange-500/20 to-white dark:to-transparent text-amber-600 dark:text-amber-400',
        teal: 'from-teal-300/25 via-emerald-100 dark:via-emerald-500/20 to-white dark:to-transparent text-teal-600 dark:text-teal-400',
        blue: 'from-sky-300/25 via-blue-100 dark:via-blue-500/20 to-white dark:to-transparent text-sky-600 dark:text-sky-400',
        rose: 'from-rose-300/25 via-orange-100 dark:via-rose-500/20 to-white dark:to-transparent text-rose-600 dark:text-rose-400',
    };

    return (
        <article className="rounded-[28px] border border-white/70 dark:border-white/10 bg-gradient-to-br dark:bg-[#231E1B] p-5 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.35)] dark:shadow-none backdrop-blur-sm">
            <div className={`mb-5 inline-flex rounded-2xl bg-gradient-to-br p-3 ${tones[tone]}`}>
                <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400">{title}</p>
            <div className="mt-2 flex items-end justify-between gap-3">
                <div>
                    <p className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                        {value}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">{detail}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950">
                    <ArrowUpRight className="h-4 w-4" />
                </span>
            </div>
        </article>
    );
}
