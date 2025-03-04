interface CardProps {
    children: React.ReactNode
    className?: string
}

export function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-6 ${className}`}>
            {children}
        </div>
    )
}
