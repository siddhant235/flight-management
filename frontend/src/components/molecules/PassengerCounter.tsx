interface PassengerCounterProps {
    label: string
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
    error?: string
}

export function PassengerCounter({
    label,
    value,
    onChange,
    min = 0,
    max = 9,
    error,
}: PassengerCounterProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => value > min && onChange(value - 1)}
                    className="rounded-full w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    disabled={value <= min}
                >
                    -
                </button>
                <span className="w-8 text-center text-gray-900 dark:text-white">{value}</span>
                <button
                    type="button"
                    onClick={() => value < max && onChange(value + 1)}
                    className="rounded-full w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    disabled={value >= max}
                >
                    +
                </button>
            </div>
            {error && <span className="text-xs text-red-500 dark:text-red-400">{error}</span>}
        </div>
    )
}
