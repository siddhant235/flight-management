'use client';

import { useEffect } from 'react';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/molecules/Button';

export default function BookingsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Bookings error:', error);
    }, [error]);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
            <Card className="p-6">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-red-600 mb-2">
                        Something went wrong!
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Failed to load your bookings. Please try again.
                    </p>
                    <Button onClick={reset} variant="primary">
                        Try again
                    </Button>
                </div>
            </Card>
        </div>
    );
} 