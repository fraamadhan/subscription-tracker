import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDeleteModal({ 
    show, 
    onClose, 
    onConfirm, 
    title = 'Delete Item',
    message = 'Are you sure you want to delete this item? This action cannot be undone.',
    confirmText = 'Delete',
    processing = false 
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-8">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-500/10">
                        <AlertTriangle className="h-10 w-10 text-rose-500" />
                    </div>
                    
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {title}
                    </h2>
                    
                    <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-gray-400 max-w-[280px]">
                        {message}
                    </p>
                </div>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <SecondaryButton 
                        onClick={onClose} 
                        className="flex-1 justify-center rounded-2xl py-3 border-slate-200 dark:border-white/10"
                    >
                        Cancel
                    </SecondaryButton>
                    <DangerButton 
                        onClick={onConfirm} 
                        disabled={processing}
                        className="flex-1 justify-center rounded-2xl py-3 bg-rose-500 hover:bg-rose-600 dark:bg-rose-500 dark:hover:bg-rose-600 shadow-lg shadow-rose-200 dark:shadow-none"
                    >
                        {confirmText}
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
}
