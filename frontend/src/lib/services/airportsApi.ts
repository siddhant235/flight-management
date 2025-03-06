import { baseApi, ApiEndpointBuilder } from '../baseApi';
import { ApiTagTypes } from '../constants/apiTags';
import type { Airport } from '@/types/airport';

export const airportsApi = baseApi.injectEndpoints({
    endpoints: (builder: ApiEndpointBuilder) => ({
        getAirports: builder.query<Airport[], void>({
            query: () => 'airports',
            providesTags: [ApiTagTypes.AIRPORTS],
        }),
        getAirportById: builder.query<Airport, string>({
            query: (id) => `airports/${id}`,
            providesTags: (result, error, id) => [{ type: ApiTagTypes.AIRPORTS, id }],
        }),
        searchAirports: builder.query<Airport[], string>({
            query: (query) => `airports/search?q=${query}`,
            providesTags: [ApiTagTypes.AIRPORTS],
        }),
    }),
});

export const {
    useGetAirportsQuery,
    useGetAirportByIdQuery,
    useSearchAirportsQuery,
} = airportsApi; 