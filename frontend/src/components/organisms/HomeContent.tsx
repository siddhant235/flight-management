'use client'

import { useState, useEffect, useMemo } from 'react'
import { Spinner } from '@/components/atoms/Spinner'
import { ErrorMessage } from '@/components/atoms/ErrorMessage'
import { FlightGrid } from '@/components/organisms/FlightGrid'
import { Title } from '@/components/atoms/Typography'
import { FlightSearchForm } from '@/components/organisms/FlightSearchForm'
import { BookingSummary } from '@/components/molecules/BookingSummary'
import type { Flight, FlightSearchFormData } from '@/types/flight'
import { useUrlSearchParams, useFlightSearch } from '@/hooks/useFlightSearch'
import { PencilIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { useSelector, useDispatch } from 'react-redux'
import { selectSearchParams, updateSearchParams } from '@/lib/features/searchSlice'

interface SearchResultsProps {
    searchResults: {
        outboundFlights: Flight[];
        returnFlights: Flight[];
    } | null | undefined;
}

// Search Results component
const SearchResults = ({ searchResults }: SearchResultsProps) => {
    if (!searchResults || (!searchResults.outboundFlights.length && !searchResults.returnFlights.length)) {
        return null
    }

    return (
        <div className="mt-8">
            <Title className="text-2xl mb-6">Available Flights</Title>
            <FlightGrid
                outboundFlights={searchResults.outboundFlights}
                returnFlights={searchResults.returnFlights}
            />
        </div>
    )
}

const SearchSummary = ({ params }: { params: FlightSearchFormData }) => {
    const totalPassengers = params.passengers.adults + params.passengers.children + params.passengers.infants;
    const passengerDetails = [
        params.passengers.adults && `${params.passengers.adults} Adult${params.passengers.adults > 1 ? 's' : ''}`,
        params.passengers.children && `${params.passengers.children} Child${params.passengers.children > 1 ? 'ren' : ''}`,
        params.passengers.infants && `${params.passengers.infants} Infant${params.passengers.infants > 1 ? 's' : ''}`
    ].filter(Boolean).join(', ');

    return (
        <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm">
            <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-sm sm:text-base">
                            <span className="font-semibold truncate max-w-[100px] sm:max-w-none">{params.origin}</span>
                            <span className="text-gray-400">→</span>
                            <span className="font-semibold truncate max-w-[100px] sm:max-w-none">{params.destination}</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-4 text-sm sm:text-base">
                        <div className="flex items-center gap-1">
                            <span className="text-gray-600 dark:text-gray-400">Departure:</span>
                            <span className="font-medium">{params.departureDate}</span>
                        </div>
                        {params.returnDate && (
                            <div className="flex items-center gap-1">
                                <span className="text-gray-600 dark:text-gray-400">Return:</span>
                                <span className="font-medium">{params.returnDate}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm border-t border-gray-200 dark:border-gray-700 pt-2">
                    <div className="flex items-center gap-1">
                        <span className="text-gray-600 dark:text-gray-400">Class:</span>
                        <span className="font-medium capitalize">{params.seatClass.toLowerCase()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-gray-600 dark:text-gray-400">Passengers:</span>
                        <span className="font-medium">{totalPassengers}</span>
                        <span className="text-gray-500 text-xs">({passengerDetails})</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function HomeContent() {
    const [isFormCollapsed, setIsFormCollapsed] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)
    const searchParams = useSelector(selectSearchParams)
    const dispatch = useDispatch()

    // Initialize URL params first
    useUrlSearchParams()

    const {
        searchResults,
        searchError,
        isSearching,
        handleSearch
    } = useFlightSearch()
    console.log(searchResults, "searchResults")
    // Handle initialization and search
    useEffect(() => {
        if (!isInitialized && searchParams.origin && searchParams.destination && searchParams.departureDate) {
            setIsInitialized(true)
            setIsFormCollapsed(true)
            handleSearch(searchParams)
        }
    }, [searchParams, isInitialized])

    // Auto collapse form when results arrive
    useEffect(() => {
        if (searchResults && (searchResults.outboundFlights.length > 0 || searchResults.returnFlights.length > 0)) {
            setIsFormCollapsed(true)
        }
    }, [searchResults])

    // Check if we have search results or valid search params
    const hasResults = searchResults && (searchResults.outboundFlights.length > 0 || searchResults.returnFlights.length > 0)
    const hasValidParams = searchParams.origin && searchParams.destination && searchParams.departureDate

    const handleSearchSubmit = (data: FlightSearchFormData) => {
        dispatch(updateSearchParams(data))
        handleSearch(data)
    }

    // Memoize the form to prevent unnecessary re-renders
    const searchForm = useMemo(() => (
        <FlightSearchForm
            key={`${searchParams.origin}-${searchParams.destination}-${searchParams.departureDate}`}
            onSearch={handleSearchSubmit}
            initialData={searchParams}
        />
    ), [searchParams, handleSearchSubmit])

    return (
        <main className="container mx-auto px-4 py-8 min-h-screen dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="z-10 bg-white dark:bg-gray-900 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <Title className="text-3xl">Search Flights</Title>
                        {(hasResults || hasValidParams) && (
                            <button
                                onClick={() => setIsFormCollapsed(!isFormCollapsed)}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                {isFormCollapsed ? (
                                    <>
                                        <PencilIcon className="h-5 w-5" />
                                        <span>Edit Search</span>
                                    </>
                                ) : (
                                    <ChevronUpIcon className="h-5 w-5" />
                                )}
                            </button>
                        )}
                    </div>

                    <div className="relative">
                        <div className={`transition-all duration-300 ease-in-out origin-top ${isFormCollapsed
                            ? 'opacity-0 max-h-0 scale-y-0 pointer-events-none'
                            : 'opacity-100 max-h-[1000px] scale-y-100'
                            }`}>
                            {searchForm}
                        </div>

                        <div className={`transition-all duration-300 ease-in-out ${isFormCollapsed
                            ? 'opacity-100 transform translate-y-0'
                            : 'opacity-0 transform -translate-y-4 pointer-events-none'
                            }`}>
                            {(hasResults || hasValidParams) && (
                                <SearchSummary params={searchParams} />
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    {isSearching && (
                        <div className="flex justify-center items-center py-12">
                            <Spinner />
                        </div>
                    )}

                    {searchError && (
                        <div className="mt-4">
                            <ErrorMessage message={searchError} />
                        </div>
                    )}

                    <div className="pb-24">
                        <SearchResults searchResults={searchResults} />
                    </div>

                    {searchResults && <BookingSummary />}
                </div>
            </div>
        </main>
    )
} 