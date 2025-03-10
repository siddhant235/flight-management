import { baseApi, ApiEndpointBuilder } from '../baseApi';
import { ApiTagTypes } from '../constants/apiTags';
import type { CreateBookingRequest, Booking } from '@/types/booking';
import { createClient } from '@/lib/supabase/client';

interface BookingsResponse {
    bookings: Booking[];
}

interface BookingDetailsResponse {
    booking: Booking;
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
        getBookingById: builder.query<BookingDetailsResponse, string>({
            query: (bookingId) => `bookings/${bookingId}`,
            providesTags: (_result, _error, bookingId) => [{ type: ApiTagTypes.BOOKINGS, id: bookingId }],
            async onCacheEntryAdded(
                bookingId,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    await cacheDataLoaded;
                    const supabase = createClient();

                    // Subscribe to specific booking updates
                    const channel = supabase
                        .channel(`booking_details_${bookingId}`)
                        .on(
                            'postgres_changes',
                            {
                                event: 'UPDATE',
                                schema: 'public',
                                table: 'booking',
                                filter: `id=eq.${bookingId}`
                            },
                            (payload) => {
                                updateCachedData((draft) => {
                                    // Update only the changed fields
                                    draft.booking = {
                                        ...draft.booking,
                                        ...payload.new
                                    };
                                });
                            }
                        )
                        .subscribe();

                    // Cleanup subscription when cache entry is removed
                    await cacheEntryRemoved;
                    channel.unsubscribe();
                } catch (error) {
                    console.error('Error in booking details subscription:', error);
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
        cancelBooking: builder.mutation<{ message: string }, string>({
            query: (bookingId) => ({
                url: `bookings/${bookingId}/cancel`,
                method: 'POST',
            }),
            invalidatesTags: (_result, _error, bookingId) => [
                { type: ApiTagTypes.BOOKINGS },
                { type: ApiTagTypes.BOOKINGS, id: bookingId }
            ],
        }),
    }),
});

export const {
    useGetUserBookingsQuery,
    useGetBookingByIdQuery,
    useCreateBookingMutation,
    useCancelBookingMutation,
} = bookingApi; 