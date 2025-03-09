'use client';

import { Suspense } from 'react';
import { useGetUserBookingsQuery } from '@/lib/services/bookingApi';
import { BookingCard } from '@/components/molecules/BookingCard';
import { Card } from '@/components/atoms/Card';
import BookingsLoading from './loading';
import { Booking } from '@/types/booking';

const EmptyState = () => (
    <Card className="p-6">
        <p className="text-center text-gray-500">No bookings found.</p>
    </Card>
);

function BookingsList() {
    const { data } = useGetUserBookingsQuery();
    console.log('data', data);
    return (
        <div className="space-y-4">
            {data?.bookings.map((booking: Booking) => (
                <BookingCard key={booking.id} booking={booking} />
            ))}
            {data?.bookings.length === 0 && <EmptyState />}
        </div>
    );
}

export default function BookingsPage() {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
            <Suspense fallback={<BookingsLoading />}>
                <BookingsList />
            </Suspense>
        </div>
    );
}