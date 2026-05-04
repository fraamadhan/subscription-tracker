import { cn } from '@/lib/utils';

export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={cn(
                'rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-black/20 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:checked:bg-indigo-500',
                className
            )}
        />
    );
}
