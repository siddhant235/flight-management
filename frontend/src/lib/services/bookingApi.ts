import { baseApi, ApiEndpointBuilder } from '../baseApi';
import { ApiTagTypes } from '../constants/apiTags';
import type { Booking, CreateBookingRequest } from '@/types/booking';

export const bookingApi = baseApi.injectEndpoints({
    endpoints: (builder: ApiEndpointBuilder) => ({
        createBooking: builder.mutation<{ message: string; bookingReference: string; booking: Booking }, CreateBookingRequest>({
            query: (body) => ({
                url: 'api/bookings/confirm',
                method: 'POST',
                body,
            }),
            invalidatesTags: [ApiTagTypes.BOOKINGS],
        }),
        // Add other booking-related queries here
    }),
});

export const {
    useCreateBookingMutation,
} = bookingApi; 