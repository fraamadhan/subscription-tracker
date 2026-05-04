import { useState, useMemo, Fragment } from 'react';
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function DatePicker({ value, onChange, className }) {
    const selectedDate = value ? new Date(value) : null;
    const [viewDate, setViewDate] = useState(selectedDate || new Date());

    const days = useMemo(() => {
        const start = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
        const end = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
        
        const dateArray = [];
        
        // Fill leading empty days
        for (let i = 0; i < start.getDay(); i++) {
            dateArray.push(null);
        }
        
        // Fill actual days
        for (let i = 1; i <= end.getDate(); i++) {
            dateArray.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), i));
        }
        
        return dateArray;
    }, [viewDate]);

    const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

    const handleSelect = (date, close) => {
        if (!date) return;
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
        onChange({ target: { name: 'nextBilling', value: adjustedDate.toISOString().split('T')[0] } });
        close();
    };

    const formattedDate = selectedDate 
        ? selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'Select date';

    return (
        <Popover className="relative">
            {({ open, close }) => (
                <>
                    <PopoverButton
                        className={cn(
                            'flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-white/10 dark:bg-warm-dark-card dark:text-white',
                            !value && 'text-slate-400 dark:text-gray-500',
                            className
                        )}
                    >
                        <CalendarIcon className="h-4 w-4 text-slate-400 dark:text-gray-500" />
                        <span className="flex-1">{formattedDate}</span>
                    </PopoverButton>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <PopoverPanel 
                            anchor="bottom start"
                            className="z-50 mt-2 w-[280px] overflow-hidden rounded-[24px] border border-slate-100 bg-white p-3 shadow-2xl dark:border-white/10 dark:bg-warm-dark-card dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                        >
                            <div className="flex items-center justify-between pb-3">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white px-1">
                                    {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                                </h3>
                                <div className="flex gap-1">
                                    <button
                                        type="button"
                                        onClick={prevMonth}
                                        className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 dark:text-white"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextMonth}
                                        className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 dark:text-white"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {DAYS.map(day => (
                                    <div key={day} className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-gray-600">
                                        {day}
                                    </div>
                                ))}
                                {days.map((date, i) => {
                                    const isSelected = date && selectedDate && isSameDay(date, selectedDate);
                                    const isToday = date && isSameDay(date, new Date());
                                    
                                    return (
                                        <div key={i} className="aspect-square p-0.5">
                                            {date ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleSelect(date, close)}
                                                    className={cn(
                                                        'flex h-full w-full items-center justify-center rounded-xl text-sm transition-all',
                                                        isSelected 
                                                            ? 'bg-amber-500 font-bold text-white shadow-lg shadow-amber-500/30' 
                                                            : 'text-slate-700 hover:bg-amber-50 dark:text-gray-300 dark:hover:bg-white/5',
                                                        isToday && !isSelected && 'border border-amber-500/50 text-amber-600 dark:text-amber-500'
                                                    )}
                                                >
                                                    {date.getDate()}
                                                </button>
                                            ) : (
                                                <div className="h-full w-full" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </PopoverPanel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}

function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
}
