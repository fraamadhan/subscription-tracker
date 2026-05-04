import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Sun, Moon, Bell, BarChart3, ShieldCheck, ArrowRight, CreditCard, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import TimunWahyuLogo from '../Components/TimunWahyuLogo';
import PrimaryButton from '../Components/PrimaryButton';

export default function Welcome({ auth }) {
    const [theme, setTheme] = useState(
        typeof window !== 'undefined' ? localStorage.getItem('theme') || 'dark' : 'dark'
    );

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col selection:bg-rose-500 selection:text-white transition-colors duration-500 bg-paper dark:bg-warm-dark text-gray-900 dark:text-gray-100 overflow-hidden">
            <Head title="Subscription Tracker" />

            {/* Background SVG Grid / Pattern */}
            <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
                <svg className="absolute w-full h-full opacity-[0.03] dark:opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                        <rect width="100%" height="100%" fill="url(#gridPattern)" />
                </svg>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-paper/50 to-paper dark:via-warm-dark/50 dark:to-warm-dark" />
            </div>

            {/* Navbar */}
            <nav className="relative z-20 flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-3">
                    <TimunWahyuLogo className="h-10 w-auto" />
                    <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Timun Wahyu</span>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full border border-gray-200 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        aria-label="Toggle Dark Mode"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {auth.user ? (
                        <Link href={route('dashboard')}>
                            <PrimaryButton>Go to Dashboard</PrimaryButton>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('login')}
                                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2"
                            >
                                Log in
                            </Link>
                            <Link href={route('register')}>
                                <PrimaryButton>Get Started</PrimaryButton>
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-4xl mx-auto text-center"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-medium mb-8 border border-rose-500/20">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                        Take control of your finances
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="mb-6 px-4 text-5xl font-extrabold leading-[1.12] tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600 md:px-6 md:text-7xl md:leading-[1.08] dark:from-white dark:to-gray-400">
                        Stop paying for <br className="hidden md:block"/> subscriptions you forget.
                    </motion.h1>

                    <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                        The elegant, high-end tracking solution. Monitor your recurring bills, receive timely WhatsApp and Email alerts, and optimize your monthly budget seamlessly.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href={route('register')}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black px-8 py-4 rounded-2xl font-semibold shadow-xl shadow-gray-900/20 dark:shadow-white/10 hover:shadow-2xl transition-all"
                            >
                                Start Tracking Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-24"
                >
                    <motion.div variants={itemVariants} className="bg-white/60 dark:bg-warm-dark-card/40 backdrop-blur-md p-8 rounded-3xl border border-white/20 dark:border-white/5 hover:border-rose-500/30 dark:hover:border-rose-500/30 transition-colors group">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Bell className="w-6 h-6 text-orange-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Smart Reminders</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            Never miss a renewal. Automate notifications directly to your WhatsApp or Email so you can cancel precisely when needed.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-white/60 dark:bg-warm-dark-card/40 backdrop-blur-md p-8 rounded-3xl border border-white/20 dark:border-white/5 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-colors group">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <BarChart3 className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Clear Analytics</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            Visualize your spending habits over time. Identify unused services instantly and re-allocate your money to what matters.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-white/60 dark:bg-warm-dark-card/40 backdrop-blur-md p-8 rounded-3xl border border-white/20 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-colors group">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Absolute Privacy</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            Your financial data never leaves your device unencrypted. We utilize a secure OTP-based login environment to keep you safe.
                        </p>
                    </motion.div>
                </motion.div>
            </main>

            {/* Simple Footer */}
            <footer className="relative z-10 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    <div className="mb-4">
                        <TimunWahyuLogo className="h-8 w-auto grayscale opacity-50" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-2">
                        developed with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> by <span className="font-bold text-gray-900 dark:text-white">fraamadhan</span> and <span className="font-bold text-amber-600">antigravity</span>
                    </p>
                    <p className="mt-2 text-xs text-gray-400 dark:text-gray-600 font-medium tracking-widest uppercase">
                        © {new Date().getFullYear()} Timun Wahyu Brand
                    </p>
                </div>
            </footer>
        </div>
    );
}
