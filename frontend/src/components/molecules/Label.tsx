interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    htmlFor: string
}

export function Label({ htmlFor, children, className = '', ...props }: LabelProps) {
    return (
        <label
            htmlFor={htmlFor}
            className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${className}`}
            {...props}
        >
            {children}
        </label>
    )
} 