'use client'

import { forwardRef } from 'react'

interface SelectOption {
    value: string
    label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string
    error?: string
    options: SelectOption[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className = '', ...props }, ref) => {
        return (
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
                <select
                    ref={ref}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                        } ${className}`}
                    {...props}
                >
                    <option value="">Select {label}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}
            </div>
        )
    }
)

Select.displayName = 'Select' 