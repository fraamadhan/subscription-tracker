import { cn } from '@/lib/utils';

export default function SidebarNav({ items, mobile = false, onNavigate }) {
    return (
        <nav aria-label="Primary navigation" className="space-y-2">
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <a
                        key={item.label}
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                            'group flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition-all',
                            item.active
                                ? 'bg-slate-900 dark:bg-amber-600 text-white shadow-lg shadow-slate-900/15 dark:shadow-amber-900/20'
                                : 'text-slate-600 dark:text-gray-400 hover:bg-white dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white',
                            mobile && 'bg-white/80 dark:bg-warm-dark/80 backdrop-blur',
                        )}
                    >
                        <span className="flex items-center gap-3">
                            <span
                                className={cn(
                                    'flex h-10 w-10 items-center justify-center rounded-2xl transition-colors',
                                    item.active
                                        ? 'bg-white/15 text-white'
                                        : 'bg-slate-100 dark:bg-warm-dark-card text-slate-500 dark:text-gray-400 group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20 group-hover:text-amber-700 dark:group-hover:text-amber-300',
                                )}
                            >
                                <Icon className="h-5 w-5" />
                            </span>
                            <span>
                                <span className="block font-semibold">
                                    {item.label}
                                </span>
                                {item.description && (
                                    <span
                                        className={cn(
                                            'block text-xs',
                                            item.active
                                                ? 'text-slate-200/85'
                                                : 'text-slate-400',
                                        )}
                                    >
                                        {item.description}
                                    </span>
                                )}
                            </span>
                        </span>

                        {item.badge && (
                            <span
                                className={cn(
                                    'rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]',
                                    item.active
                                        ? 'bg-white/15 text-white'
                                        : 'bg-slate-100 text-slate-500',
                                )}
                            >
                                {item.badge}
                            </span>
                        )}
                    </a>
                );
            })}
        </nav>
    );
}
