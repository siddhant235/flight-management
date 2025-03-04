interface TextProps {
    children: React.ReactNode
    className?: string
}

export function Title({ children, className = '' }: TextProps) {
    return (
        <h2 className={`text-xl font-semibold mb-2 text-gray-900 dark:text-white ${className}`}>
            {children}
        </h2>
    )
}

export function Text({ children, className = '' }: TextProps) {
    return (
        <p className={`text-gray-700 dark:text-gray-300 ${className}`}>
            {children}
        </p>
    )
}

export function Label({ children, className = '' }: TextProps) {
    return (
        <span className={`font-medium text-gray-600 dark:text-gray-400 ${className}`}>
            {children}
        </span>
    )
}
