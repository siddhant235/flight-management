import { baseApi, ApiEndpointBuilder } from '../baseApi'
import { ApiTagTypes } from '../constants/apiTags'
import type { Flight, FlightSearchParams, Booking, SeatClassType } from '@/types/flight'

interface SearchResponse {
    outboundFlights: Flight[];
    returnFlights: Flight[];
}

export const flightApi = baseApi.injectEndpoints({
    endpoints: (builder: ApiEndpointBuilder) => ({
        getFlights: builder.query<Flight[], void>({
            query: () => 'flights',
            providesTags: [{ type: ApiTagTypes.FLIGHTS }],
        }),
        searchFlights: builder.mutation<SearchResponse, FlightSearchParams>({
            query: (params) => ({
                url: 'flights/search',
                method: 'POST',
                body: params,
            }),
        }),
        getFlightById: builder.query<Flight, { id: string, seatClass: SeatClassType }>({
            query: ({ id, seatClass }) => `flights/${id}?seatClass=${seatClass}`,
        }),
        bookFlight: builder.mutation<Booking, { flightId: string; passengers: number }>({
            query: (data) => ({
                url: 'flights/book',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: ApiTagTypes.FLIGHTS }],
        }),
    }),
})

export const {
    useGetFlightsQuery,
    useSearchFlightsMutation,
    useGetFlightByIdQuery,
    useBookFlightMutation
} = flightApi
