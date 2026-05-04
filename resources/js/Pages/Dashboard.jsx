import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { cn } from '@/lib/utils';
import BillingActivityItem from '@/Components/Dashboard/BillingActivityItem';
import MetricCard from '@/Components/Dashboard/MetricCard';
import SectionPanel from '@/Components/Dashboard/SectionPanel';
import SubscriptionCard from '@/Components/Dashboard/SubscriptionCard';
import SubscriptionFormModal from '@/Components/Dashboard/SubscriptionFormModal';
import CategoryManagementModal from '@/Components/Dashboard/CategoryManagementModal';
import PaymentMethodManagementModal from '@/Components/Dashboard/PaymentMethodManagementModal';
import ConfirmDeleteModal from '@/Components/Dashboard/ConfirmDeleteModal';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    BellRing,
    ChevronDown,
    CircleDollarSign,
    CreditCard,
    FolderKanban,
    Layers3,
    Plus,
    Sparkles,
    TrendingUp,
    WalletCards,
} from 'lucide-react';

export default function Dashboard({ 
    subscriptions = [], 
    categories = [], 
    paymentMethods = [], 
    billingHistory = { data: [], links: [] },
    metrics: realMetrics,
    filters
}) {
    const formatIDR = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount).replace('Rp', 'Rp ');
    };

    const handleFilterChange = (key, value) => {
        router.get(route('dashboard'), { ...filters, [key]: value }, { preserveState: true, preserveScroll: true });
    };

    const handleClearDates = () => {
        router.get(route('dashboard'), { period: filters.period }, { preserveState: true, preserveScroll: true });
    };

    const metrics = [
        {
            title: `${filters.period === 'yearly' ? 'Yearly' : 'Monthly'} active spend`,
            value: formatIDR(realMetrics.total_spend),
            detail: 'Calculated based on active subscriptions',
            icon: CircleDollarSign,
            tone: 'amber',
        },
        {
            title: 'Active subscriptions',
            value: `${realMetrics.active_subs_count} services`,
            detail: `Across ${categories.length} categories`,
            icon: FolderKanban,
            tone: 'emerald',
        },
        {
            title: 'Next renewal window',
            value: `${realMetrics.due_soon_count} due soon`,
            detail: realMetrics.due_soon_services.length > 0 
                ? `${realMetrics.due_soon_services.join(' and ')} renew soon`
                : 'No renewals in the next 7 days',
            icon: BellRing,
            tone: 'rose',
        },
        {
            title: 'Payment coverage',
            value: `${realMetrics.payment_methods_count} methods`,
            detail: 'Bank cards and e-wallets mapped',
            icon: CreditCard,
            tone: 'blue',
        },
    ];

    // Remove the local subscriptions state and use props instead.
    // The metrics are still hardcoded for now, but subscriptions are dynamic.

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [displayCurrency, setDisplayCurrency] = useState('IDR');
    const [selectedSubscription, setSelectedSubscription] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const totalPages = Math.ceil(subscriptions.length / itemsPerPage);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [subscriptions.length, totalPages, currentPage]);

    const currentSubscriptions = subscriptions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleAdd = () => {
        setSelectedSubscription(null);
        setIsFormOpen(true);
    };

    const handleEdit = (sub) => {
        // Map UI data back to form fields if needed
        const formData = {
            ...sub,
            category_id: sub.categoryId,
            payment_method_id: sub.paymentMethodId,
            billing_cycle: sub.cycle,
            next_billing_date: sub.nextBilling,
            color_hex: sub.color,
        };
        setSelectedSubscription(formData);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (sub) => {
        setSelectedSubscription(sub);
        setIsDeleteOpen(true);
    };

    const handleSaveSubscription = (data) => {
        const payload = {
            ...data,
            category_id: (categories || []).find(c => c.name === data.category)?.id || data.category_id,
            payment_method_id: (paymentMethods || []).find(m => m.name === data.paymentMethod)?.id || data.payment_method_id,
            billing_cycle: data.cycle,
            next_billing_date: data.nextBilling,
            color_hex: data.color,
        };

        if (selectedSubscription?.id) {
            router.put(route('subscriptions.update', selectedSubscription.id), payload, {
                onSuccess: () => setIsFormOpen(false),
            });
        } else {
            router.post(route('subscriptions.store'), payload, {
                onSuccess: () => setIsFormOpen(false),
            });
        }
    };

    const handleDeleteConfirm = () => {
        router.delete(route('subscriptions.destroy', selectedSubscription.id), {
            onSuccess: () => setIsDeleteOpen(false),
        });
    };

    const convertCurrency = (amount, from, to) => {
        const rates = {
            'IDR': 1,
            'USD': 16200,
            'GBP': 20500,
        };
        const amountInIdr = (parseFloat(amount) || 0) * (rates[from] || 1);
        return amountInIdr / (rates[to] || 1);
    };

    // Only count subscriptions that are assigned to a known category
    const getNormalizedPrice = (sub) => {
        const idrPrice = convertCurrency(sub.price, sub.currency, 'IDR');
        let monthly = idrPrice;
        
        switch (sub.cycle) {
            case 'daily': monthly = idrPrice * 30; break;
            case 'weekly': monthly = idrPrice * 4; break;
            case 'monthly': monthly = idrPrice; break;
            case 'yearly': monthly = idrPrice / 12; break;
        }

        return filters.period === 'yearly' ? monthly * 12 : monthly;
    };

    const overallTotalNormalized = subscriptions.reduce((acc, sub) => acc + getNormalizedPrice(sub), 0);
    
    const categoryBreakdown = categories.map(cat => {
        const catSubscriptions = subscriptions.filter(sub => String(sub.categoryId) === String(cat.id));
        const catSpendInIdr = catSubscriptions.reduce((acc, sub) => acc + getNormalizedPrice(sub), 0);
        
        const rawCoverage = overallTotalNormalized > 0 ? (catSpendInIdr / overallTotalNormalized) * 100 : 0;
        
        return {
            label: cat.name,
            amount: formatIDR(catSpendInIdr),
            coverage: (rawCoverage > 0 && rawCoverage < 1 ? rawCoverage.toFixed(1) : Math.round(rawCoverage)) + '%',
            color_hex: cat.color_hex,
            width: (overallTotalNormalized > 0 && catSpendInIdr > 0) ? `${Math.max(2, (catSpendInIdr / overallTotalNormalized) * 100)}%` : '0%',
        };
    }).sort((a, b) => parseFloat(b.coverage) - parseFloat(a.coverage));

    // Use billing history from props (paginated)
    const historyData = billingHistory?.data || [];
    const billingHistoryItems = historyData.length > 0 ? historyData : [
        {
            service: 'No activity yet',
            date: '-',
            amount: '-',
            detail: 'Start marking subscriptions as paid to see history.',
            status: 'upcoming',
        },
    ];

    // Payment methods from props are more detailed
    const activePaymentMethods = (paymentMethods || []).map(m => ({
        name: m.name,
        usage: `${(subscriptions || []).filter(s => s.paymentMethodId === m.id).length} subscriptions`,
        note: `Payment method registered in your profile`,
    }));

    // Generate dynamic reminders based on subscriptions
    const getDaysDifference = (dateString) => {
        if (!dateString) return 999;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const [year, month, day] = dateString.split('-');
        const billingDate = new Date(year, month - 1, day);
        
        const diffTime = billingDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const upcomingReminders = (subscriptions || [])
        .map(sub => ({ ...sub, diffDays: getDaysDifference(sub.nextBilling) }))
        .filter(sub => sub.diffDays >= -7 && sub.diffDays <= 7)
        .sort((a, b) => a.diffDays - b.diffDays)
        .map(sub => {
            if (sub.diffDays < 0) {
                return `Your ${sub.name} subscription is overdue by ${Math.abs(sub.diffDays)} day(s).`;
            } else if (sub.diffDays === 0) {
                return `Your ${sub.name} subscription is renewing today.`;
            } else if (sub.diffDays === 1) {
                return `${sub.name} will automatically renew tomorrow.`;
            } else {
                return `Your ${sub.name} subscription is renewing in ${sub.diffDays} days.`;
            }
        });

    const reminderMessages = upcomingReminders.length > 0 
        ? upcomingReminders 
        : ['You have no upcoming renewals in the next 7 days.'];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard">
                <meta
                    name="description"
                    content="Monitor subscriptions, billing schedules, payment methods, and monthly spend from one modern dashboard."
                />
            </Head>

            <div className="mx-auto max-w-7xl space-y-6">
                <section
                    id="overview"
                    className="overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,_rgba(15,23,42,0.96)_0%,_rgba(30,41,59,0.96)_45%,_rgba(120,53,15,0.92)_100%)] px-5 py-6 text-white shadow-[0_35px_100px_-40px_rgba(15,23,42,0.65)] md:px-8 md:py-8"
                >
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
                        <div>
                            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
                                <Sparkles className="h-4 w-4" />
                                Financial dashboard
                            </p>
                            <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
                                Take control of your subscriptions.
                            </h1>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                                Monitor your monthly spending, track upcoming renewals, and manage all your active subscriptions in one place.
                            </p>
                            <div className="mt-8 flex flex-col gap-5">
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex rounded-2xl bg-white/10 p-1 backdrop-blur-md">
                                        {['monthly', 'yearly', 'custom'].map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => handleFilterChange('period', p)}
                                                className={cn(
                                                    "px-4 py-2 text-sm font-semibold transition-all rounded-xl",
                                                    filters.period === p
                                                        ? "bg-white text-slate-900 shadow-lg"
                                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                                )}
                                            >
                                                {p.charAt(0).toUpperCase() + p.slice(1)}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Month/Year Selectors */}
                                    {filters.period !== 'custom' && (
                                        <div className="flex items-center gap-3">
                                            {filters.period === 'monthly' && (
                                                <div className="relative group">
                                                    <select
                                                        value={filters.month}
                                                        onChange={(e) => handleFilterChange('month', e.target.value)}
                                                        className="appearance-none rounded-2xl border border-white/20 bg-white/10 dark:bg-white/5 px-5 py-2.5 pr-11 text-sm font-semibold text-white backdrop-blur-xl transition-all hover:bg-white/20 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 cursor-pointer"
                                                    >
                                                        {Array.from({ length: 12 }, (_, i) => (
                                                            <option key={i + 1} value={i + 1} className="bg-slate-900 text-white">
                                                                {new Date(2000, i).toLocaleString('en-US', { month: 'long' })}
                                                        </option>
                                                        ))}
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-amber-200/60 group-hover:text-amber-200">
                                                        <ChevronDown className="h-4 w-4" />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="relative group">
                                                <select
                                                    value={filters.year}
                                                    onChange={(e) => handleFilterChange('year', e.target.value)}
                                                    className="appearance-none rounded-2xl border border-white/20 bg-white/10 dark:bg-white/5 px-5 py-2.5 pr-11 text-sm font-semibold text-white backdrop-blur-xl transition-all hover:bg-white/20 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 cursor-pointer"
                                                >
                                                    {Array.from({ length: 5 }, (_, i) => (
                                                        <option key={i} value={new Date().getFullYear() - 2 + i} className="bg-slate-900 text-white">
                                                            {new Date().getFullYear() - 2 + i}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-amber-200/60 group-hover:text-amber-200">
                                                    <ChevronDown className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {filters.period === 'custom' && (
                                    <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Start Date</label>
                                            <input 
                                                type="date" 
                                                value={filters.start_date || ''} 
                                                onChange={(e) => handleDateChange('start_date', e.target.value)}
                                                className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:border-amber-400 focus:ring-0"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">End Date</label>
                                            <input 
                                                type="date" 
                                                value={filters.end_date || ''} 
                                                onChange={(e) => handleDateChange('end_date', e.target.value)}
                                                className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:border-amber-400 focus:ring-0"
                                            />
                                        </div>
                                        {(filters.start_date || filters.end_date) && (
                                            <button 
                                                onClick={handleClearDates}
                                                className="mt-5 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold uppercase hover:bg-white/20"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <a
                                    href="#subscriptions"
                                    className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-50"
                                >
                                    Review subscriptions
                                </a>
                                <a
                                    href="#billing-history"
                                    className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                                >
                                    Open billing timeline
                                </a>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-slate-200">
                                        Spending trend
                                    </p>
                                    <TrendingUp className="h-5 w-5 text-amber-300" />
                                </div>
                                <div className="mt-6 flex items-end gap-2 h-24">
                                    {realMetrics.spending_trend.length > 0 ? (
                                        realMetrics.spending_trend.map((item, index) => (
                                            <div key={item.month} className="group relative flex flex-1 flex-col items-center gap-2">
                                                <div
                                                    className="w-full rounded-t-lg bg-gradient-to-t from-amber-400 via-orange-400 to-white/80 transition-all group-hover:from-amber-300 group-hover:via-orange-300"
                                                    style={{ 
                                                        height: `${Math.max(20, (item.total / Math.max(...realMetrics.spending_trend.map(t => t.total))) * 100)}%`,
                                                        opacity: 0.6 + (index * 0.08)
                                                    }}
                                                />
                                                <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                                                    {item.month}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        [48, 62, 58, 76, 71, 88].map((height, index) => (
                                            <div
                                                key={index}
                                                className="flex-1 rounded-t-full bg-gradient-to-t from-amber-300 via-orange-300 to-white/80"
                                                style={{ height: `${height}%`, opacity: 0.5 + index * 0.06 }}
                                            />
                                        ))
                                    )}
                                </div>
                                <p className="mt-4 text-sm text-slate-300">
                                    Estimated annual spend: <span className="font-semibold text-white">{formatIDR(realMetrics.estimated_annual_spend)}</span>
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                                    <p className="text-sm text-slate-300">
                                        Reminder coverage
                                    </p>
                                    <p className="mt-2 text-3xl font-semibold">
                                        {realMetrics.reminder_coverage}%
                                    </p>
                                    <p className="mt-2 text-sm text-slate-300">
                                        {realMetrics.covered_plans_count} plans have active billing dates set.
                                    </p>
                                </div>
                                <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                                    <p className="text-sm text-slate-300">
                                        FX exposure
                                    </p>
                                    <p className="mt-2 text-3xl font-semibold">
                                        {realMetrics.fx_exposure_count} services
                                    </p>
                                    <p className="mt-2 text-sm text-slate-300">
                                        Non-IDR subscriptions are normalized for analytics.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric) => (
                        <MetricCard key={metric.title} {...metric} />
                    ))}
                </section>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
                    <SectionPanel
                        id="subscriptions"
                        eyebrow="Overview"
                        title="Active subscriptions"
                        description="View and manage your active subscription plans, pricing, and upcoming renewal dates."
                        actions={
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => setIsPaymentModalOpen(true)}
                                    className="inline-flex items-center rounded-2xl border border-slate-200 dark:border-white/10 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-gray-300 transition hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10"
                                >
                                    Map payment methods
                                </button>
                                <button
                                    onClick={handleAdd}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add <span className="hidden sm:inline">Subscription</span>
                                </button>
                            </div>
                        }
                    >
                        <div className="grid gap-4 lg:grid-cols-2">
                            {currentSubscriptions.map((subscription) => (
                                <SubscriptionCard
                                    key={subscription.name}
                                    subscription={subscription}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteClick}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-4">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="text-sm font-medium text-slate-500 hover:text-slate-700 disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-300"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-slate-500 dark:text-gray-400">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="text-sm font-medium text-slate-500 hover:text-slate-700 disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-300"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </SectionPanel>

                    <SectionPanel
                        id="categories"
                        eyebrow="Analytics"
                        title="Category spending breakdown"
                        description="See exactly how much you are spending across different categories."
                        actions={
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 rounded-2xl border border-slate-200 dark:border-white/10 p-1 bg-slate-50 dark:bg-white/5">
                                    {['IDR', 'USD', 'GBP'].map((curr) => (
                                        <button
                                            key={curr}
                                            onClick={() => setDisplayCurrency(curr)}
                                            className={cn(
                                                "px-3 py-1.5 text-[10px] font-bold rounded-xl transition-all",
                                                displayCurrency === curr
                                                    ? "bg-white dark:bg-white/10 text-amber-600 dark:text-amber-500 shadow-sm"
                                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                                            )}
                                        >
                                            {curr}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setIsCategoryModalOpen(true)}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-white/10 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-gray-300 transition hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10"
                                >
                                    <Plus className="h-4 w-4" />
                                    Manage
                                </button>
                            </div>
                        }
                    >
                        <div className="space-y-4">
                            {categoryBreakdown.map((category) => (
                                <div key={category.label}>
                                    <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                                        <span className="font-medium text-slate-700 dark:text-gray-300">
                                            {category.label}
                                        </span>
                                        <span className="text-slate-500 dark:text-gray-400">
                                            {category.amount} • {category.coverage}
                                        </span>
                                    </div>
                                    <div className="h-3 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                                        <div
                                            className="h-3 rounded-full transition-all duration-500"
                                            style={{ 
                                                backgroundColor: category.color_hex,
                                                width: category.width
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionPanel>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.35fr)]">
                    <SectionPanel
                        id="reminders"
                        eyebrow="Notifications"
                        title="Renewal reminders"
                        description="Keep track of upcoming renewals so you're never caught off guard."
                    >
                        <div className="space-y-4">
                            {reminderMessages.map((message, index) => (
                                <div
                                    key={index}
                                    className="rounded-[24px] border border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-warm-dark/40 p-4 text-sm leading-6 text-slate-600 dark:text-gray-300"
                                >
                                    {message}
                                </div>
                            ))}
                        </div>
                    </SectionPanel>

                    <SectionPanel
                        id="billing-history"
                        eyebrow="History"
                        title="Billing timeline"
                        description="Review your past payments and track your subscription history over time."
                    >
                        <ul className="space-y-4">
                            {billingHistoryItems.map((item) => (
                                <BillingActivityItem
                                    key={item.id || item.service}
                                    item={item}
                                />
                            ))}
                        </ul>

                        {billingHistory?.links && billingHistory?.links?.length > 3 && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                {billingHistory.links.map((link, i) => {
                                    const baseClass = "px-4 py-2 text-sm font-semibold rounded-xl border transition-colors";
                                    const disabledClass = "text-slate-300 dark:text-gray-600 border-slate-100 dark:border-white/5 cursor-not-allowed";
                                    const enabledClass = "text-slate-600 dark:text-gray-400 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5";

                                    const handlePageClick = (url) => {
                                        if (!url) return;
                                        router.visit(url, {
                                            preserveScroll: true,
                                            preserveState: true,
                                            only: ['billingHistory'],
                                        });
                                    };

                                    if (link.label.includes('Previous')) {
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => handlePageClick(link.url)}
                                                disabled={!link.url}
                                                className={cn(baseClass, link.url ? enabledClass : disabledClass)}
                                            >
                                                ← Previous
                                            </button>
                                        );
                                    }

                                    if (link.label.includes('Next')) {
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => handlePageClick(link.url)}
                                                disabled={!link.url}
                                                className={cn(baseClass, link.url ? enabledClass : disabledClass)}
                                            >
                                                Next →
                                            </button>
                                        );
                                    }

                                    // Numbered page links
                                    const numBase = "hidden sm:flex h-10 w-10 items-center justify-center text-sm font-semibold rounded-xl border transition-all";
                                    const activeClass = "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg";
                                    const inactiveClass = "text-slate-600 dark:text-gray-400 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5";

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handlePageClick(link.url)}
                                            disabled={!link.url}
                                            className={cn(numBase, link.active ? activeClass : inactiveClass)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </SectionPanel>
                </div>

                <SectionPanel
                    id="payment-methods"
                    eyebrow="Settings"
                    title="Payment methods"
                    description="Manage the cards and e-wallets used to pay for your subscriptions."
                    actions={
                        <button
                            onClick={() => setIsPaymentModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-white/10 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-gray-300 transition hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10"
                        >
                            <Plus className="h-4 w-4" />
                            Manage
                        </button>
                    }
                >
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {activePaymentMethods.map((method) => (
                            <article
                                key={method.name}
                                className="rounded-[28px] border border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-warm-dark/40 p-5"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 dark:bg-white/10 text-white">
                                    <WalletCards className="h-5 w-5" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
                                    {method.name}
                                </h3>
                                <p className="mt-1 text-sm font-medium text-amber-700 dark:text-amber-500">
                                    {method.usage}
                                </p>
                                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-gray-400">
                                    {method.note}
                                </p>
                            </article>
                        ))}
                    </div>
                </SectionPanel>
            </div>

            <SubscriptionFormModal
                show={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSave={handleSaveSubscription}
                onDelete={handleDeleteClick}
                initialData={selectedSubscription}
                paymentMethods={paymentMethods}
                categories={categories}
            />

            <ConfirmDeleteModal
                show={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Subscription?"
                message={selectedSubscription ? `Are you sure you want to delete ${selectedSubscription.name}? This action cannot be undone.` : ''}
            />

            <CategoryManagementModal
                show={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                categories={categories}
            />

            <PaymentMethodManagementModal
                show={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                paymentMethods={paymentMethods}
            />
        </AuthenticatedLayout>
    );
}
