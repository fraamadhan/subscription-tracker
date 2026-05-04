import { useState } from 'react';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import ConfirmDeleteModal from './ConfirmDeleteModal';

export default function CategoryManagementModal({
    show,
    onClose,
    categories = [],
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [data, setData] = useState({ name: '', color_hex: '#3b82f6' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

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

    const resetForm = () => {
        setData({ name: '', color_hex: '#3b82f6' });
        setIsEditing(false);
        setEditingCategory(null);
        setErrors({});
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setData({ name: category.name, color_hex: category.color_hex });
        setIsEditing(true);
    };

    const handleDelete = (category) => {
        if (category.subscriptions_count > 0) return;
        setCategoryToDelete(category);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!categoryToDelete) return;
        
        router.delete(route('categories.destroy', categoryToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setCategoryToDelete(null);
            },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const options = {
            onSuccess: () => {
                resetForm();
                setIsLoading(false);
            },
            onError: (err) => {
                setErrors(err);
                setIsLoading(false);
            },
            preserveScroll: true,
        };

        if (isEditing) {
            router.put(route('categories.update', editingCategory.id), data, options);
        } else {
            router.post(route('categories.store'), data, options);
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            {/* Sticky header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 md:px-8 md:pt-8">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    Manage Categories
                </h2>
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
                            {isEditing ? 'Edit Category' : 'Create New Category'}
                        </h3>
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div>
                                <InputLabel htmlFor="cat_name" value="Category Name" className="text-slate-700 dark:text-gray-300" />
                                <TextInput
                                    id="cat_name"
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                    className="mt-1 block w-full bg-white dark:bg-warm-dark-card border-slate-200 dark:border-white/10 dark:text-white"
                                    placeholder="e.g. Work, Entertainment"
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel value="Pick a Color" className="text-slate-700 dark:text-gray-300" />
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {colors.map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setData({ ...data, color_hex: c })}
                                            className={cn(
                                                'h-7 w-7 rounded-full transition-transform',
                                                data.color_hex === c
                                                    ? 'scale-110 ring-2 ring-slate-900 ring-offset-2 dark:ring-white dark:ring-offset-warm-dark'
                                                    : 'hover:scale-110'
                                            )}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                                <InputError message={errors.color_hex} className="mt-2" />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <PrimaryButton
                                    disabled={isLoading}
                                    className="flex-1 justify-center rounded-2xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700"
                                >
                                    {isEditing ? 'Update Category' : 'Create Category'}
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
                            Existing Categories
                        </h3>
                        <div className="mt-4 grid gap-3 pb-8">
                            {categories.length === 0 ? (
                                <p className="text-sm text-slate-500 italic">No categories yet.</p>
                            ) : (
                                categories.map((cat) => (
                                    <div
                                        key={cat.id}
                                        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-warm-dark-card"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="h-4 w-4 rounded-full"
                                                style={{ backgroundColor: cat.color_hex }}
                                            />
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {cat.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleEdit(cat)}
                                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-white/5 dark:hover:text-white"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat)}
                                                className={cn(
                                                    "rounded-xl p-2 transition-colors",
                                                    cat.subscriptions_count > 0 
                                                        ? "text-slate-200 dark:text-gray-700 cursor-not-allowed" 
                                                        : "text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-500"
                                                )}
                                                title={cat.subscriptions_count > 0 ? `Used by ${cat.subscriptions_count} subscriptions` : "Delete category"}
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
                title="Delete Category?"
                message={`Are you sure you want to delete "${categoryToDelete?.name}"? Any subscriptions using this category will be unassigned.`}
            />
        </Modal>
    );
}
