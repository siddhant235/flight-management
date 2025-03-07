import { baseApi } from '../baseApi'
import type { CreateBookingRequest, CreateBookingResponse } from '@/types/booking'
import { ApiTagTypes } from '../constants/apiTags'

export const bookingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBooking: builder.mutation<CreateBookingResponse, CreateBookingRequest>({
            query: (bookingData) => ({
                url: '/api/bookings',
                method: 'POST',
                body: bookingData,
            }),
            invalidatesTags: [
                ApiTagTypes.FLIGHTS,
                ApiTagTypes.BOOKINGS,
            ],
        }),
    }),
})

export const { useCreateBookingMutation } = bookingApi 