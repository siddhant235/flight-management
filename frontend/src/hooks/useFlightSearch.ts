import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useSearchFlightsMutation } from '@/lib/services/flightApi'
import { clearSelectedFlights } from '@/lib/features/selectedFlightsSlice'
import {
    updateSearchParams,
    selectIsSearching,
    selectSearchParams,
    selectSearchResults,
    selectSearchError,
    setSearchResults,
    setSearchError,
    setIsSearching
} from '@/lib/features/searchSlice'
import type { FlightSearchFormData } from '@/types/flight'
import { TripType, SeatClassType } from '@/types/flight'

// Helper function to update URL parameters
const updateUrlParams = (formData: FlightSearchFormData, router: ReturnType<typeof useRouter>) => {
    const params = new URLSearchParams()
    params.set('tripType', formData.tripType)
    params.set('origin', formData.origin)
    params.set('destination', formData.destination)
    params.set('departureDate', formData.departureDate)
    if (formData.returnDate) {
        params.set('returnDate', formData.returnDate)
    }
    params.set('seatClass', formData.seatClass)
    params.set('adults', formData.passengers.adults.toString())
    params.set('children', formData.passengers.children.toString())
    params.set('infants', formData.passengers.infants.toString())

    router.push(`?${params.toString()}`, { scroll: false })
}

// Helper function to check if search params are valid
const hasValidSearchParams = (params: URLSearchParams): boolean => {
    return !!(
        params.get('origin') &&
        params.get('destination') &&
        params.get('departureDate')
    )
}

// Custom hook to handle URL search params
export const useUrlSearchParams = () => {
    const searchParams = useSearchParams()
    const dispatch = useDispatch()
    const [searchFlights] = useSearchFlightsMutation()
    const existingResults = useSelector(selectSearchResults)

    useEffect(() => {
        if (!searchParams) return

        const params = new URLSearchParams(searchParams.toString())

        if (hasValidSearchParams(params)) {
            const formData: FlightSearchFormData = {
                tripType: (params.get('tripType') as TripType) || TripType.ROUND_TRIP,
                origin: params.get('origin') as string,
                destination: params.get('destination') as string,
                departureDate: params.get('departureDate') as string,
                returnDate: params.get('returnDate') || '',
                seatClass: (params.get('seatClass') as SeatClassType) || SeatClassType.ECONOMY,
                passengers: {
                    adults: parseInt(params.get('adults') || '1'),
                    children: parseInt(params.get('children') || '0'),
                    infants: parseInt(params.get('infants') || '0'),
                }
            }

            // Update the search params in Redux
            dispatch(updateSearchParams(formData))

            // Only trigger search if we don't have existing results
            if (!existingResults) {
                dispatch(setIsSearching(true))
                searchFlights(formData)
                    .unwrap()
                    .then((results) => {
                        dispatch(setSearchResults(results))
                    })
                    .catch((error) => {
                        dispatch(setSearchError(error.data?.error || 'Error searching flights'))
                    })
            }
        }
    }, [searchParams?.toString()])
}

// Custom hook to handle flight search
export const useFlightSearch = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [searchFlights] = useSearchFlightsMutation()
    const isSearching = useSelector(selectIsSearching)
    const currentSearchParams = useSelector(selectSearchParams)
    const searchResults = useSelector(selectSearchResults)
    const searchError = useSelector(selectSearchError)

    const handleSearch = (formData: FlightSearchFormData) => {
        dispatch(clearSelectedFlights()) // Clear selected flights only on new search
        dispatch(updateSearchParams(formData))
        dispatch(setIsSearching(true))

        searchFlights(formData)
            .unwrap()
            .then((results) => {
                dispatch(setSearchResults(results))
            })
            .catch((error) => {
                dispatch(setSearchError(error.data?.error || 'Error searching flights'))
            })

        updateUrlParams(formData, router)
    }

    return {
        searchResults,
        searchError,
        isSearching,
        currentSearchParams,
        handleSearch
    }
} 