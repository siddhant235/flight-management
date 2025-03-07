import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({ className = '', variant = 'primary', disabled, children, ...props }: ButtonProps) {
    const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors';
    const variantStyles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
        outline: 'border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800'
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
} 