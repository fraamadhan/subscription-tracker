import { cn } from '@/lib/utils';

export default function SectionPanel({
    id,
    eyebrow,
    title,
    description,
    actions,
    children,
    className = '',
}) {
    return (
        <section
            id={id}
            className={cn(
                'rounded-[32px] border border-white/70 dark:border-white/10 bg-white/88 dark:bg-warm-dark-card/60 p-5 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] dark:shadow-none backdrop-blur md:p-7',
                className,
            )}
        >
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-2xl">
                    {eyebrow && (
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">
                            {eyebrow}
                        </p>
                    )}
                    <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-2xl">
                        {title}
                    </h2>
                    {description && (
                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-gray-400">
                            {description}
                        </p>
                    )}
                </div>
                {actions && <div className="shrink-0">{actions}</div>}
            </div>
            <div className="mt-5">{children}</div>
        </section>
    );
}
