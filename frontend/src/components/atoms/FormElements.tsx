interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string
    options: { value: string; label: string }[]
    error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <input
                className={`rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none ${error ? 'border-red-500 dark:border-red-400' : ''
                    } ${className}`}
                {...props}
            />
            {error && <span className="text-xs text-red-500 dark:text-red-400">{error}</span>}
        </div>
    )
}

export function Select({ label, options, error, className = '', ...props }: SelectProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <select
                className={`rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none ${error ? 'border-red-500 dark:border-red-400' : ''
                    } ${className}`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span className="text-xs text-red-500 dark:text-red-400">{error}</span>}
        </div>
    )
}

export function RadioGroup({ label, options, value, onChange, error }: {
    label: string
    options: { value: string; label: string }[]
    value: string
    onChange: (value: string) => void
    error?: string
}) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <div className="flex gap-4">
                {options.map((option) => (
                    <label key={option.value} className="flex items-center gap-2">
                        <input
                            type="radio"
                            value={option.value}
                            checked={value === option.value}
                            onChange={(e) => onChange(e.target.value)}
                            className="text-blue-500 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                    </label>
                ))}
            </div>
            {error && <span className="text-xs text-red-500 dark:text-red-400">{error}</span>}
        </div>
    )
}
