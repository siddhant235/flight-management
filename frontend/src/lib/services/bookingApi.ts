import { baseApi, ApiEndpointBuilder } from '../baseApi';
import { ApiTagTypes } from '../constants/apiTags';
import type { CreateBookingRequest } from '@/types/booking';
import type { Booking } from '@/types/booking';

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

export const bookingApi = baseApi.injectEndpoints({
    endpoints: (builder: ApiEndpointBuilder) => ({
        getUserBookings: builder.query<BookingsResponse, void>({
            query: () => 'bookings',
            providesTags: [ApiTagTypes.BOOKINGS],
            extraOptions: {
                refetchOnReconnect: true,
                refetchOnMountOrArgChange: true
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