import { useState } from 'react';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Plus, Pencil, Trash2, X, WalletCards } from 'lucide-react';
import { cn } from '@/lib/utils';
import ConfirmDeleteModal from './ConfirmDeleteModal';

export default function PaymentMethodManagementModal({
    show,
    onClose,
    paymentMethods = [],
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingMethod, setEditingMethod] = useState(null);
    const [data, setData] = useState({ name: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [methodToDelete, setMethodToDelete] = useState(null);

    const resetForm = () => {
        setData({ name: '' });
        setIsEditing(false);
        setEditingMethod(null);
        setErrors({});
    };

    const handleEdit = (method) => {
        setEditingMethod(method);
        setData({ name: method.name });
        setIsEditing(true);
    };

    const handleDelete = (method) => {
        if (method.subscriptions_count > 0) return;
        setMethodToDelete(method);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!methodToDelete) return;
        
        router.delete(route('payment_methods.destroy', methodToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setMethodToDelete(null);
            },
            onError: (err) => {
                // Handle deletion error (e.g. if in use)
                if (err.error) alert(err.error);
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                resetForm();
                setIsLoading(false);
            },
            onError: (err) => {
                setErrors(err);
                setIsLoading(false);
            },
            onFinish: () => setIsLoading(false),
        };

        if (isEditing) {
            router.put(route('payment_methods.update', editingMethod.id), data, options);
        } else {
            router.post(route('payment_methods.store'), data, options);
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            {/* Sticky header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 md:px-8 md:pt-8">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-white/10 text-white">
                        <WalletCards className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        Manage Payment Methods
                    </h2>
                </div>
                <button
                    onClick={onClose}
                    className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto max-h-[70vh] aesthetic-scrollbar">
                <div className="px-6 md:px-8 space-y-6">
                    {/* Form Section */}
                    <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-5 dark:border-white/5 dark:bg-white/5">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                            {isEditing ? 'Edit Method' : 'Add New Method'}
                        </h3>
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div>
                                <InputLabel htmlFor="method_name" value="Method Name" className="text-slate-700 dark:text-gray-300" />
                                <TextInput
                                    id="method_name"
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                    className="mt-1 block w-full bg-white dark:bg-warm-dark-card border-slate-200 dark:border-white/10 dark:text-white"
                                    placeholder="e.g. BCA Visa, GoPay, Jago"
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <PrimaryButton
                                    disabled={isLoading}
                                    className="flex-1 justify-center rounded-2xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700"
                                >
                                    {isEditing ? 'Update Method' : 'Add Method'}
                                </PrimaryButton>
                                {isEditing && (
                                    <SecondaryButton
                                        onClick={resetForm}
                                        type="button"
                                        className="rounded-2xl"
                                    >
                                        Cancel
                                    </SecondaryButton>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* List Section */}
                    <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
                            Your Methods
                        </h3>
                        <div className="mt-4 grid gap-3 pb-8">
                            {paymentMethods.length === 0 ? (
                                <p className="text-sm text-slate-500 italic">No methods added yet.</p>
                            ) : (
                                paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-warm-dark-card"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 dark:bg-white/5 text-slate-400">
                                                <WalletCards className="h-4 w-4" />
                                            </div>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {method.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleEdit(method)}
                                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-white/5 dark:hover:text-white"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(method)}
                                                className={cn(
                                                    "rounded-xl p-2 transition-colors",
                                                    method.subscriptions_count > 0 
                                                        ? "text-slate-200 dark:text-gray-700 cursor-not-allowed" 
                                                        : "text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-500"
                                                )}
                                                title={method.subscriptions_count > 0 ? `Used by ${method.subscriptions_count} subscriptions` : "Delete payment method"}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDeleteModal
                show={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Payment Method?"
                message={`Are you sure you want to delete "${methodToDelete?.name}"? You can't delete methods that are currently linked to subscriptions.`}
            />
        </Modal>
    );
}
