import { baseApi } from '../baseApi'
import type { FlightSearchFormData } from '@/types/flight'

export interface Flight {
    id: string
    airline: string
    flightNumber: string
    departureAirport: string
    arrivalAirport: string
    departureTime: string
    arrivalTime: string
    status: string
    remarks: string | null
    availableSeats: number
    price: number
    seatClass: string
}

interface SearchResponse {
    outboundFlights: Flight[]
    returnFlights: Flight[]
}

export const flightApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFlights: builder.query<Flight[], void>({
            query: () => 'api/flights',
            providesTags: ['Flights'],
        }),
        searchFlights: builder.mutation<SearchResponse, FlightSearchFormData>({
            query: (searchParams) => ({
                url: 'api/flights/search',
                method: 'POST',
                body: searchParams,
            }),
            invalidatesTags: ['Flights'],
        }),
    }),
})

export const {
    useGetFlightsQuery,
    useSearchFlightsMutation
} = flightApi
