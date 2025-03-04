'use client'

import {
    createApi,
    fetchBaseQuery,
    FetchArgs,
    FetchBaseQueryError,
    BaseQueryFn,
    EndpointBuilder
} from '@reduxjs/toolkit/query/react'

export interface ApiError {
    status: number
    data: {
        message: string
        code: string
        details?: Record<string, unknown>
    }
}

export type TagTypes = 'Flights' | 'Auth' | 'User' | 'Bookings'

// Custom error handling for the base query
const baseQueryWithErrorHandling: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const result = await baseQuery(args, api, extraOptions)

    if (result.error) {
        const err = result.error as FetchBaseQueryError
        if ('status' in err) {
            // Handle specific error cases
            switch (err.status) {
                case 401:
                    console.error('Unauthorized access')
                    break
                case 403:
                    console.error('Forbidden access')
                    break
                case 500:
                    console.error('Server error')
                    break
            }
        }
    }

    return result
}

// Base API configuration
export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: () => ({}),
    tagTypes: ['Flights', 'Auth', 'User', 'Bookings'],
})

export type ApiEndpointBuilder = EndpointBuilder<
    typeof baseQueryWithErrorHandling,
    TagTypes,
    typeof baseApi.reducerPath
>

// Export hooks for usage in components
export const {
    util: { getRunningQueriesThunk },
} = baseApi
