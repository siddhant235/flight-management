import { baseApi, ApiEndpointBuilder } from '../baseApi';
import { ApiTagTypes } from '../constants/apiTags';
import type { CreateBookingRequest, Booking } from '@/types/booking';
import { createClient } from '@/lib/supabase/client';

// interface Passenger {
//     id: string;
//     first_name: string;
//     last_name: string;
//     email: string;
//     phone: string;
//     gender: string;
//     seat_class: string;
//     seat_number: string;
// }

// interface Flight {
//     id: string;
//     airline: string;
//     flight_number: string;
//     departure_airport: string;
//     arrival_airport: string;
//     economy_price: number;
//     premium_economy_price: number;
//     business_price: number;
//     first_class_price: number;
// }

// interface BookingDetails {
//     id: string;
//     booking_reference: string;
//     booking_status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
//     total_amount: number;
//     departure_date: string;
//     departure_time: string;
//     arrival_date: string;
//     arrival_time: string;
//     created_at: string;
//     flights: Flight;
//     passengers: Passenger[];
// }

interface BookingsResponse {
    bookings: Booking[];
}

export const subscribeToBookingStatus = (bookingId: string, onStatusChange: (status: string) => void) => {
    const supabase = createClient();

    const subscription = supabase
        .channel(`booking_status_${bookingId}`)
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'booking',
                filter: `id=eq.${bookingId}`
            },
            (payload) => {
                const newStatus = payload.new.booking_status;
                onStatusChange(newStatus);
            }
        )
        .subscribe();

    return () => {
        subscription.unsubscribe();
    };
};

export const bookingApi = baseApi.injectEndpoints({
    endpoints: (builder: ApiEndpointBuilder) => ({
        getUserBookings: builder.query<BookingsResponse, void>({
            query: () => 'bookings',
            providesTags: [ApiTagTypes.BOOKINGS],
            async onCacheEntryAdded(
                _arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    await cacheDataLoaded;
                    const supabase = createClient();

                    // Subscribe to all booking updates for the current user
                    const channel = supabase
                        .channel('booking_updates')
                        .on(
                            'postgres_changes',
                            {
                                event: 'UPDATE',
                                schema: 'public',
                                table: 'booking'
                            },
                            (payload) => {
                                updateCachedData((draft) => {
                                    const bookingIndex = draft.bookings.findIndex(
                                        (b) => b.id === payload.new.id
                                    );
                                    if (bookingIndex !== -1) {
                                        // Update only the changed fields
                                        draft.bookings[bookingIndex] = {
                                            ...draft.bookings[bookingIndex],
                                            ...payload.new
                                        };
                                    }
                                });
                            }
                        )
                        .subscribe();

                    // Cleanup subscription when cache entry is removed
                    await cacheEntryRemoved;
                    channel.unsubscribe();
                } catch (error) {
                    console.error('Error in booking subscription:', error);
                }
            }
        }),
        createBooking: builder.mutation<{ message: string; bookingReference: string; booking: Booking }, CreateBookingRequest>({
            query: (body) => ({
                url: 'bookings/confirm',
                method: 'POST',
                body,
            }),
            invalidatesTags: [ApiTagTypes.BOOKINGS],
        }),
    }),
});

export const {
    useGetUserBookingsQuery,
    useCreateBookingMutation,
} = bookingApi; 