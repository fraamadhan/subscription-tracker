import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { Head } from '@inertiajs/react';

export default function AuthLayout({ children, title }) {
    const [theme, setTheme] = useState(
        // Default to dark mode based on project requirements, or read from localStorage
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

    return (
        <div className={`min-h-screen relative flex items-center justify-center p-4 selection:bg-rose-500 selection:text-white transition-colors duration-500 bg-paper dark:bg-warm-dark text-gray-900 dark:text-gray-100 overflow-hidden`}>
            <Head title={title} />
            
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
                {/* Subtle radial gradient to center focus */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-paper/50 to-paper dark:via-warm-dark/50 dark:to-warm-dark" />
            </div>

            {/* Dark Mode Toggle */}
            <button
                onClick={toggleTheme}
                className="absolute top-6 right-6 z-20 p-2 rounded-full border border-gray-200 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle Dark Mode"
            >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth Card Container */}
            <div className="w-full max-w-md z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={title} // Animate on page change based on title
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-white/70 dark:bg-warm-dark-card/60 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                    >
                        {/* Decorative subtle glass shine */}
                        <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                        
                        {children}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
