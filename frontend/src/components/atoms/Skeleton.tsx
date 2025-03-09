import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
    return (
        <div
            className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}
            {...props}
        />
    );
}; 