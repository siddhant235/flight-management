import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}; 