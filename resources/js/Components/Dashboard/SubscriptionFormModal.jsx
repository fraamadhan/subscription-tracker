import { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DatePicker from '@/Components/DatePicker';
import DangerButton from '@/Components/DangerButton';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

export default function SubscriptionFormModal({
    show,
    onClose,
    onSave,
    onDelete,
    initialData = null,
    paymentMethods = [],
    categories = [],
}) {
    const defaultData = {
        name: '',
        category: 'Entertainment',
        currency: 'IDR',
        price: '',
        cycle: 'monthly',
        paymentMethod: '',
        nextBilling: '',
        note: '',
        color: '#f59e0b', // amber-500
    };

    const [data, setData] = useState(defaultData);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (show) {
            setData(initialData || defaultData);
            setErrors({});
        }
    }, [show, initialData]);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        const newErrors = {};
        if (!data.name) newErrors.name = 'Name is required.';
        if (!data.price) newErrors.price = 'Price is required.';
        if (!data.color) newErrors.color = 'Color is required.';
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSave({
            ...data,
            price: data.price,
        });
    };


    const colors = [
        '#ef4444', // red-500
        '#f97316', // orange-500
        '#f59e0b', // amber-500
        '#10b981', // emerald-500
        '#06b6d4', // cyan-500
        '#3b82f6', // blue-500
        '#8b5cf6', // violet-500
        '#d946ef', // fuchsia-500
    ];

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            {/* Sticky header */}
            <div className="px-6 pt-6 pb-4 md:px-8 md:pt-8">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    {initialData ? 'Edit Subscription' : 'Add Subscription'}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                    {initialData
                        ? 'Update the details for this subscription.'
                        : 'Track a new recurring expense.'}
                </p>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto max-h-[70vh] aesthetic-scrollbar">
                <form onSubmit={handleSubmit} className="px-6 md:px-8 space-y-5">
                    <div>
                        <InputLabel htmlFor="name" value="Service Name" className="text-slate-700 dark:text-gray-300" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            className="mt-1 block w-full bg-white dark:bg-warm-dark-card border-slate-200 dark:border-white/10 dark:text-white"
                            placeholder="e.g. Netflix, Spotify"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <InputLabel htmlFor="currency" value="Currency" className="text-slate-700 dark:text-gray-300" />
                            <select
                                id="currency"
                                name="currency"
                                value={data.currency}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-warm-dark-card text-slate-950 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                            >
                                <option value="IDR">IDR</option>
                                <option value="USD">USD</option>
                                <option value="GBP">GBP</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel htmlFor="price" value="Price" className="text-slate-700 dark:text-gray-300" />
                            <TextInput
                                id="price"
                                name="price"
                                type="number"
                                step="any"
                                value={data.price}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-white dark:bg-warm-dark-card border-slate-200 dark:border-white/10 dark:text-white"
                                placeholder="15.99"
                            />
                            <InputError message={errors.price} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="cycle" value="Cycle" className="text-slate-700 dark:text-gray-300" />
                            <select
                                id="cycle"
                                name="cycle"
                                value={data.cycle}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-warm-dark-card text-slate-950 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                            >
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="category" value="Category" className="text-slate-700 dark:text-gray-300" />
                            <select
                                id="category"
                                name="category"
                                value={data.category}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-warm-dark-card text-slate-950 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <InputLabel htmlFor="paymentMethod" value="Payment Method" className="text-slate-700 dark:text-gray-300" />
                            <select
                                id="paymentMethod"
                                name="paymentMethod"
                                value={data.paymentMethod}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-warm-dark-card text-slate-950 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                            >
                                <option value="">Select Method</option>
                                {paymentMethods.map((method) => (
                                    <option key={method.name} value={method.name}>
                                        {method.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="nextBilling" value="Next Billing Date" className="text-slate-700 dark:text-gray-300" />
                        <DatePicker
                            value={data.nextBilling}
                            onChange={handleChange}
                            className="mt-1"
                        />
                        <InputError message={errors.nextBilling} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="note" value="Notes" className="text-slate-700 dark:text-gray-300" />
                        <textarea
                            id="note"
                            name="note"
                            value={data.note}
                            onChange={handleChange}
                            rows={2}
                            className="mt-1 block w-full rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-warm-dark-card text-slate-950 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                            placeholder="e.g. Shared with 4 screens"
                        />
                    </div>

                    <div>
                        <InputLabel value="Color Label" className="text-slate-700 dark:text-gray-300" />
                        <div className="mt-2 flex flex-wrap gap-3">
                            {colors.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setData({ ...data, color: c })}
                                    className={cn(
                                        'h-8 w-8 rounded-full transition-transform',
                                        data.color === c
                                            ? 'scale-110 ring-2 ring-slate-900 ring-offset-2 dark:ring-white dark:ring-offset-warm-dark'
                                            : 'hover:scale-110'
                                    )}
                                    style={{ backgroundColor: c }}
                                    aria-label={`Select color ${c}`}
                                />
                            ))}
                        </div>
                        <InputError message={errors.color} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-between py-6 border-t border-slate-100 dark:border-white/5 mt-4">
                        <div>
                            {initialData && (
                                <DangerButton 
                                    type="button"
                                    onClick={() => onDelete(initialData)}
                                    className="rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 border-none shadow-none"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </DangerButton>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <SecondaryButton onClick={onClose}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton className="rounded-2xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700">
                                Save
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
