'use client'

import {
    createApi,
    fetchBaseQuery,
    FetchArgs,
    FetchBaseQueryError,
    BaseQueryFn,
    EndpointBuilder
} from '@reduxjs/toolkit/query/react'
import { ApiTagTypes } from './constants/apiTags'
import { createClient } from './supabase/client'

export interface ApiError {
    status: number
    data: {
        message: string
        code: string
        details?: Record<string, unknown>
    }
}

// Custom error handling for the base query
const baseQueryWithErrorHandling: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    const baseQuery = fetchBaseQuery({
        baseUrl: typeof window !== 'undefined' ? window.location.origin : '',
        credentials: 'include',
        prepareHeaders: (headers) => {
            if (session?.access_token) {
                headers.set('Authorization', `Bearer ${session.access_token}`)
            }
            headers.set('Content-Type', 'application/json')
            return headers
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
    tagTypes: Object.values(ApiTagTypes),
})

export type ApiEndpointBuilder = EndpointBuilder<
    typeof baseQueryWithErrorHandling,
    ApiTagTypes,
    typeof baseApi.reducerPath
>

export const { util: { getRunningQueriesThunk } } = baseApi
