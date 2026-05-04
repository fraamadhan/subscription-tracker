import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Toast() {
    const { flash } = usePage().props;
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setMessage(flash.success || flash.error);
            setType(flash.success ? 'success' : 'error');
            setIsVisible(true);
            const timer = setTimeout(() => setIsVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="fixed bottom-8 left-1/2 z-[100] -translate-x-1/2"
                >
                    <div className={cn(
                        "flex items-center gap-3 rounded-2xl border px-6 py-4 shadow-2xl backdrop-blur-xl transition-all",
                        type === 'success' 
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400"
                    )}>
                        {type === 'success' ? (
                            <CheckCircle2 className="h-5 w-5 shrink-0" />
                        ) : (
                            <AlertCircle className="h-5 w-5 shrink-0" />
                        )}
                        <p className="text-sm font-semibold tracking-tight">{message}</p>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="ml-2 rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/5"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
