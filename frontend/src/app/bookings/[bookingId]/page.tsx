'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Spinner } from '@/components/atoms/Spinner';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { Button } from '@/components/molecules/Button';
import { ConfirmationModal } from '@/components/molecules/ConfirmationModal';
import { toast } from 'sonner';
import {
    BookingHeader,
    FlightDetails,
    PassengerDetails,
    PaymentDetails
} from '@/components/organisms/BookingDetails';
import { useGetBookingByIdQuery, useCancelBookingMutation } from '@/lib/services/bookingApi';

export default function BookingDetailsPage() {
    const { bookingId } = useParams();
    const { data, isLoading, error } = useGetBookingByIdQuery(bookingId as string);
    const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
    const [showCancelModal, setShowCancelModal] = useState(false);

    const handleCancelBooking = async () => {
        try {
            await cancelBooking(bookingId as string).unwrap();
            toast.success('Booking cancelled successfully');
            setShowCancelModal(false);
        } catch {
            toast.error('Failed to cancel booking');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto max-w-4xl px-4 py-8">
                <ErrorMessage message="Failed to load booking details" />
            </div>
        );
    }

    if (!data?.booking) {
        return (
            <div className="container mx-auto max-w-4xl px-4 py-8">
                <ErrorMessage message="Booking not found" />
            </div>
        );
    }

    const { booking } = data;
    const canCancel = booking.booking_status !== 'CANCELLED';

    return (
        <main className="container mx-auto max-w-4xl px-4 py-8">
            <div className="space-y-6">
                <BookingHeader
                    reference={booking.booking_reference}
                    status={booking.booking_status}
                />
                <FlightDetails booking={booking} />
                <PassengerDetails passengers={booking.passengers} />
                <PaymentDetails
                    amount={booking.total_amount}
                    date={booking.created_at}
                />
                {canCancel && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            onClick={() => setShowCancelModal(true)}
                            disabled={isCancelling}
                            variant="danger"
                            className="w-full"
                        >
                            Cancel Booking
                        </Button>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleCancelBooking}
                title="Cancel Booking"
                message="Are you sure you want to cancel this booking? This action cannot be undone."
                confirmText="Yes, Cancel Booking"
                cancelText="No, Keep Booking"
                isLoading={isCancelling}
            />
        </main>
    );
} 