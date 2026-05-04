import SidebarNav from "@/Components/Dashboard/SidebarNav";
import { Link, usePage } from "@inertiajs/react";
import {
    BellRing,
    CreditCard,
    FolderKanban,
    LayoutDashboard,
    LogOut,
    Menu,
    ReceiptText,
    Settings2,
    Tags,
    WalletCards,
    X,
    Sun,
    Moon,
    HelpCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import Toast from "@/Components/Toast";
import Onboarding from "@/Components/Dashboard/Onboarding";
import TimunWahyuLogo from "@/Components/TimunWahyuLogo";

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [showSidebar, setShowSidebar] = useState(false);
    const [onboardingOpen, setOnboardingOpen] = useState(false);
    
    // Theme logic from AuthLayout
    const [theme, setTheme] = useState(
        typeof window !== 'undefined' ? localStorage.getItem('theme') || 'dark' : 'dark'
    );

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        if (!hasSeenOnboarding) {
            setTimeout(() => setOnboardingOpen(true), 1500);
        }
    }, []);

    const closeOnboarding = () => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        setOnboardingOpen(false);
    };

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const dashboardBase = route("dashboard");
    const navigation = [
        {
            label: "Overview",
            description: "Financial cockpit",
            href: `${dashboardBase}#overview`,
            icon: LayoutDashboard,
            active: route().current("dashboard"),
        },
        {
            label: "Subscriptions",
            description: "Track active plans",
            href: `${dashboardBase}#subscriptions`,
            icon: CreditCard,
        },
        {
            label: "Categories",
            description: "Organize spending",
            href: `${dashboardBase}#categories`,
            icon: Tags,
        },
        {
            label: "Reminders",
            description: "Stay ahead of renewals",
            href: `${dashboardBase}#reminders`,
            icon: BellRing,
        },
        {
            label: "Billing History",
            description: "Payment trail",
            href: `${dashboardBase}#billing-history`,
            icon: ReceiptText,
        },
        {
            label: "Payment Methods",
            description: "Cards and wallets",
            href: `${dashboardBase}#payment-methods`,
            icon: WalletCards,
        },
        {
            label: "Profile",
            description: "Account settings",
            href: route("profile.edit"),
            icon: Settings2,
            active: route().current("profile.edit"),
        },
    ];

    return (
        <div className={`h-screen overflow-hidden flex transition-colors duration-500 bg-paper dark:bg-warm-dark text-slate-950 dark:text-gray-100`}>
            {/* Background pattern similar to AuthLayout to keep it consistent and aesthetic */}
            <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
                <svg className="absolute w-full h-full opacity-[0.03] dark:opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="gridPatternDashboard" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#gridPatternDashboard)" />
                </svg>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-paper/50 to-paper dark:via-warm-dark/50 dark:to-warm-dark" />
            </div>

            {/* --- DESKTOP SIDEBAR (INDEPENDENTLY SCROLLABLE) --- */}
            <aside className="relative z-10 hidden h-screen w-[320px] shrink-0 border-r border-gray-200 dark:border-white/10 bg-white/60 dark:bg-warm-dark-card/60 backdrop-blur-xl xl:flex xl:flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none">
                <div className="flex h-full flex-col overflow-y-auto px-6 py-8 aesthetic-scrollbar overscroll-contain">
                    <Link
                        href="/"
                        className="flex shrink-0 items-center gap-3"
                    >
                        <TimunWahyuLogo className="h-10 w-auto" />
                        <div>
                            <span className="block text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
                                Subscription Tracker
                            </span>
                            <span className="block text-xs text-slate-500 dark:text-gray-400">
                                Powered by Timun Wahyu
                            </span>
                        </div>
                    </Link>

                    <nav className="mt-10 flex-1">
                        <SidebarNav items={navigation} />
                    </nav>

                    {/* Profile Card Section */}
                    <div className="mt-10 shrink-0">
                        <div className="rounded-[28px] border border-gray-200 dark:border-white/10 bg-slate-950 dark:bg-[#1a1614] p-5 text-white shadow-xl shadow-slate-950/10 dark:shadow-none relative overflow-hidden">
                            {/* Decorative element */}
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
                            
                            <p className="text-xs font-medium text-white/50 uppercase tracking-wider relative z-10">
                                Signed in as
                            </p>
                            <p className="mt-2 font-semibold truncate relative z-10 text-white">
                                {user?.name}
                            </p>
                            <p className="mt-0.5 text-sm text-white/60 truncate relative z-10">
                                {user?.email ?? user?.phone_number}
                            </p>
                            <div className="mt-6 flex flex-col gap-2 relative z-10">
                                <Link
                                    href={route("profile.edit")}
                                    className="flex justify-center rounded-2xl bg-white/10 dark:bg-white/5 py-3 text-sm font-medium transition hover:bg-white/20 dark:hover:bg-white/10 text-white"
                                >
                                    Manage profile
                                </Link>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-[#2d2420] py-3 text-sm font-bold text-slate-950 dark:text-white transition hover:bg-amber-50 dark:hover:bg-[#3d312c]"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Log out
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA (INDEPENDENTLY SCROLLABLE) --- */}
            <div className="relative z-10 flex h-screen flex-1 flex-col overflow-hidden">
                {/* MOBILE TOP NAV */}
                <div className="sticky top-0 z-30 border-b border-gray-200 dark:border-white/10 bg-white/75 dark:bg-warm-dark/75 backdrop-blur xl:hidden">
                    <div className="flex items-center justify-between px-4 py-4">
                        <button
                            type="button"
                            onClick={() => setShowSidebar(true)}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-warm-dark-card text-slate-700 dark:text-gray-300 shadow-sm"
                            aria-label="Open navigation"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="text-center">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">
                                Subscription Tracker
                            </p>
                            <p className="text-sm font-semibold text-slate-950 dark:text-white">
                                {user?.name}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleTheme}
                                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-warm-dark-card text-slate-700 dark:text-gray-300 shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                                aria-label="Toggle Dark Mode"
                            >
                                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </button>
                            <Link
                                href={route("profile.edit")}
                                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 dark:bg-white text-sm font-semibold text-white dark:text-slate-950 shadow-lg shadow-slate-950/20 dark:shadow-white/10"
                            >
                                {user?.name?.slice(0, 1).toUpperCase()}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* MOBILE OVERLAY NAVIGATION */}
                {showSidebar && (
                    <div className="fixed inset-0 z-50 xl:hidden">
                        <div
                            className="absolute inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowSidebar(false)}
                        />
                        <div className="relative h-full w-[85%] max-w-[320px] bg-paper dark:bg-warm-dark p-6 shadow-2xl transition-transform flex flex-col">
                            <div className="flex items-center justify-between shrink-0">
                                <div>
                                    <p className="text-lg font-bold text-slate-950 dark:text-white">
                                        Navigate
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-gray-400">
                                        Core subscription tools
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowSidebar(false)}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-warm-dark-card text-slate-700 dark:text-gray-300"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="mt-8 flex-1 overflow-y-auto aesthetic-scrollbar">
                                <SidebarNav
                                    items={navigation}
                                    mobile
                                    onNavigate={() => setShowSidebar(false)}
                                />
                            </div>

                            <div className="mt-6 shrink-0">
                                <div className="rounded-[24px] bg-slate-950 dark:bg-[#1a1614] border border-transparent dark:border-white/10 p-5 text-white">
                                    <p className="text-xs text-white/50 truncate">
                                        {user?.email ?? user?.phone_number}
                                    </p>
                                    <div className="mt-4 flex gap-2">
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="w-full rounded-xl bg-white dark:bg-[#2d2420] py-2 text-center text-sm font-bold text-slate-950 dark:text-white"
                                        >
                                            Log out
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* THEME TOGGLE & HELP FOR DESKTOP */}
                <div className="hidden xl:flex absolute top-6 right-10 z-20 items-center gap-3">
                    <button
                        onClick={() => setOnboardingOpen(true)}
                        className="p-2.5 rounded-full border border-gray-200 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm"
                        aria-label="Show Tour"
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-full border border-gray-200 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm"
                        aria-label="Toggle Dark Mode"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>

                <Toast />
                <Onboarding open={onboardingOpen} onClose={closeOnboarding} />

                {/* DYNAMIC SCROLLING CONTENT */}
                <main className="flex-1 overflow-y-auto aesthetic-scrollbar overscroll-contain px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
                    {header && (
                        <header className="mb-8 rounded-[32px] border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-warm-dark-card/60 px-6 py-6 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.05)] dark:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] backdrop-blur xl:pr-24">
                            {header}
                        </header>
                    )}
                    <div className="mx-auto max-w-7xl pb-10">{children}</div>
                </main>
            </div>
        </div>
    );
}
