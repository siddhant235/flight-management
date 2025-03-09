import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export const getErrorMessage = (error: FetchBaseQueryError | undefined) => {
    if (!error) return null
    if ('data' in error && typeof error.data === 'object' && error.data && 'error' in error.data) {
        return error.data.error as string
    }
    return "Error searching flights"
} 