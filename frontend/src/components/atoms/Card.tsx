interface CardProps {
    children: React.ReactNode
    className?: string
    onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-2 ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    )
}
