import { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Sparkles, ArrowRight, Check, X } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

const STEPS = [
    {
        title: "Welcome to SubTracker!",
        description: "Your financial control center is ready. Let's take a 30-second tour to see how to manage your subscriptions.",
        icon: Sparkles,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400",
    },
    {
        title: "Track Subscriptions",
        description: "Add your Netflix, Spotify, or SaaS tools. Choose currency, billing cycle, and even pick a custom color for your card.",
        icon: ArrowRight,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400",
    },
    {
        title: "Automated Reminders",
        description: "We'll send you alerts on WhatsApp and Email before your renewal date so you can decide whether to keep or cancel.",
        icon: Check,
        image: "https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&q=80&w=400",
    }
];

export default function Onboarding({ open, onClose }) {
    const [step, setStep] = useState(0);

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(step + 1);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (step > 0) setStep(step - 1);
    };

    const currentStep = STEPS[step];
    const Icon = currentStep.icon;

    return (
        <Transition show={open} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={() => {}}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="relative w-full max-w-xl overflow-hidden rounded-[36px] bg-white dark:bg-warm-dark shadow-2xl border border-slate-100 dark:border-white/10">
                                <button
                                    onClick={onClose}
                                    className="absolute right-6 top-6 z-20 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="relative h-48 md:h-full overflow-hidden">
                                        <AnimatePresence mode="wait">
                                            <motion.img
                                                key={step}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                src={currentStep.image}
                                                className="h-full w-full object-cover"
                                                alt="onboarding"
                                            />
                                        </AnimatePresence>
                                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-warm-dark md:bg-gradient-to-r" />
                                    </div>

                                    <div className="p-8 md:p-10 flex flex-col justify-center">
                                        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-500">
                                            <Icon className="h-6 w-6" />
                                        </div>

                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={step}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                            >
                                                <h3 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                                                    {currentStep.title}
                                                </h3>
                                                <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-gray-400">
                                                    {currentStep.description}
                                                </p>
                                            </motion.div>
                                        </AnimatePresence>

                                        <div className="mt-14 space-y-6">
                                            <div className="flex justify-center gap-1.5">
                                                {STEPS.map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={cn(
                                                            "h-1.5 rounded-full transition-all duration-300",
                                                            i === step ? "w-8 bg-amber-500" : "w-1.5 bg-slate-200 dark:bg-white/10"
                                                        )}
                                                    />
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-end gap-3">
                                                {step > 0 && (
                                                    <SecondaryButton onClick={handlePrev} className="rounded-2xl px-6 py-2.5">
                                                        Back
                                                    </SecondaryButton>
                                                )}
                                                <PrimaryButton onClick={handleNext} className="bg-amber-600 hover:bg-amber-700 rounded-2xl py-2.5">
                                                    {step === STEPS.length - 1 ? 'Finish' : 'Next'}
                                                </PrimaryButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
