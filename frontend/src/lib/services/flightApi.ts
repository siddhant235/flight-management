import { baseApi, ApiEndpointBuilder } from '../baseApi'
import { ApiTagTypes } from '../constants/apiTags'
import type { Flight, FlightSearchParams, Booking } from '@/types/flight'

interface SearchResponse {
    outboundFlights: Flight[];
    returnFlights: Flight[];
}

export const flightApi = baseApi.injectEndpoints({
    endpoints: (builder: ApiEndpointBuilder) => ({
        getFlights: builder.query<Flight[], void>({
            query: () => 'api/flights',
            providesTags: [{ type: ApiTagTypes.FLIGHTS }],
        }),
        searchFlights: builder.mutation<SearchResponse, FlightSearchParams>({
            query: (params) => ({
                url: 'api/flights/search',
                method: 'POST',
                body: params,
            }),
        }),
        getFlightById: builder.query<Flight, string>({
            query: (id) => `api/flights/${id}`,
            providesTags: (result, error, id) => [{ type: ApiTagTypes.FLIGHTS, id }],
        }),
        bookFlight: builder.mutation<Booking, { flightId: string; passengers: number }>({
            query: (data) => ({
                url: 'api/flights/book',
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
