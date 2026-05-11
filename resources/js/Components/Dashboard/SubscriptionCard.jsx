import { useState } from 'react';
import { router } from '@inertiajs/react';
import { CalendarDays, CreditCard, Layers3, MoreHorizontal, Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import Dropdown from '@/Components/Dropdown';

export default function SubscriptionCard({ subscription, onEdit, onDelete }) {
    const [isLoading, setIsLoading] = useState(false);

    const formatPrice = (price, currency) => {
        const symbols = {
            IDR: 'Rp',
            USD: '$',
            GBP: '£',
        };
        const symbol = symbols[currency] || '';
        
        const numPrice = parseFloat(price);
        if (isNaN(numPrice)) return price;

        const formatted = new Intl.NumberFormat(currency === 'IDR' ? 'id-ID' : 'en-US').format(numPrice);
        
        return `${symbol}${formatted}`;
    };

    // Plain JS date diff — no external library needed
    const daysUntilNextBilling = subscription.nextBilling
        ? Math.ceil((new Date(subscription.nextBilling) - new Date()) / (1000 * 60 * 60 * 24))
        : null;

    const isDueSoon = daysUntilNextBilling !== null && daysUntilNextBilling <= 7;
    const isOverdue = daysUntilNextBilling !== null && daysUntilNextBilling < 0;

    const handleMarkAsPaid = () => {
        setIsLoading(true);
        router.post(route('subscriptions.mark-as-paid', subscription.id), {}, {
            onFinish: () => setIsLoading(false),
        });
    };

    return (
        <article className="flex flex-col h-full rounded-[28px] border border-slate-100 dark:border-white/5 bg-slate-50/90 dark:bg-warm-dark-card p-6 transition-transform duration-200 hover:-translate-y-1 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span
                        className="h-3.5 w-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: subscription.color }}
                    />
                    <p className="text-lg font-bold text-slate-950 dark:text-white leading-tight">
                        {subscription.name}
                    </p>
                </div>
                
                <div className="-mr-2 -mt-2 shrink-0">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/10 transition-all hover:text-slate-600 dark:hover:text-white">
                                <MoreHorizontal className="h-5 w-5" />
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="right" width="48">
                            <button
                                onClick={() => onEdit(subscription)}
                                className="flex w-full items-center gap-2 px-4 py-3 text-start text-sm font-medium leading-5 text-slate-700 dark:text-gray-300 transition duration-150 ease-in-out hover:bg-slate-100 dark:hover:bg-white/5 focus:bg-slate-100 dark:focus:bg-white/5 focus:outline-none"
                            >
                                <Pencil className="h-4 w-4" />
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(subscription)}
                                className="flex w-full items-center gap-2 px-4 py-3 text-start text-sm font-medium leading-5 text-rose-600 dark:text-rose-500 transition duration-150 ease-in-out hover:bg-rose-50 dark:hover:bg-rose-500/10 focus:bg-rose-50 focus:outline-none"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </button>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>

            <div className="mt-3 flex items-center gap-2.5">
                <span className="rounded-full bg-slate-200/50 dark:bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300">
                    {subscription.cycle}
                </span>
                <span className="text-sm font-medium text-slate-500 dark:text-gray-400">
                    {subscription.category}
                </span>
            </div>

            <div className="mt-6 flex-1 grid gap-3.5 text-sm text-slate-600 dark:text-gray-300 content-start">
                <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-slate-400 dark:text-gray-500 shrink-0" />
                    <span className="font-medium leading-tight">
                        {formatPrice(subscription.price, subscription.currency)} / {subscription.cycle} via {subscription.paymentMethod}
                    </span>
                </div>
                <div className="flex items-start gap-3">
                    <CalendarDays className="h-5 w-5 text-slate-400 dark:text-gray-500 shrink-0" />
                    <span className="font-medium leading-tight">
                        Next bill on {subscription.nextBilling ? new Date(subscription.nextBilling).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Pending...'}
                    </span>
                </div>
                {subscription.note && (
                    <div className="flex items-start gap-3">
                        <Layers3 className="h-5 w-5 text-slate-400 dark:text-gray-500 shrink-0" />
                        <span className="font-medium leading-tight line-clamp-2">{subscription.note}</span>
                    </div>
                )}
            </div>
            
            <div className="mt-8 flex flex-col gap-3">
                {isDueSoon ? (
                    <button
                        onClick={handleMarkAsPaid}
                        disabled={isLoading}
                        className={cn(
                            "w-full flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all shadow-sm text-white",
                            isOverdue 
                                ? "bg-rose-500 hover:bg-rose-600 shadow-rose-200 dark:shadow-none"
                                : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200 dark:shadow-none",
                            isLoading && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>{isLoading ? 'Processing...' : (isOverdue ? 'Pay Overdue' : 'Mark as Paid')}</span>
                    </button>
                ) : (
                    <div className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-100 dark:bg-white/5 px-4 py-3.5 border border-slate-200 dark:border-white/5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="text-sm font-bold text-slate-600 dark:text-gray-400">
                            Scheduled
                        </span>
                    </div>
                )}
                
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onDelete(subscription)}
                        className="flex-1 flex items-center justify-center gap-2 h-11 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent text-rose-600 dark:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all shadow-sm hover:shadow-md"
                        title="Delete subscription"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="text-xs font-bold">Delete</span>
                    </button>
                    <button
                        onClick={() => onEdit(subscription)}
                        className="flex-1 flex items-center justify-center gap-2 h-11 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-sm hover:shadow-md"
                        title="Edit subscription"
                    >
                        <Pencil className="h-4 w-4" />
                        <span className="text-xs font-bold">Edit</span>
                    </button>
                </div>
            </div>
        </article>
    );
}

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
