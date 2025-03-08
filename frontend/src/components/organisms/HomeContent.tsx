'use client'

import { Spinner } from '@/components/atoms/Spinner'
import { ErrorMessage } from '@/components/atoms/ErrorMessage'
import { FlightGrid } from '@/components/organisms/FlightGrid'
import { Title } from '@/components/atoms/Typography'
import { FlightSearchForm } from '@/components/organisms/FlightSearchForm'
import { BookingSummary } from '@/components/molecules/BookingSummary'
import type { Flight } from '@/types/flight'
import { useUrlSearchParams, useFlightSearch } from '@/hooks/useFlightSearch'

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

export function HomeContent() {
    // Initialize URL params first
    useUrlSearchParams()

    const {
        searchResults,
        searchError,
        isSearching,
        currentSearchParams,
        handleSearch
    } = useFlightSearch()

    return (
        <main className="container mx-auto px-4 py-8 min-h-screen dark:bg-gray-900 pb-24">
            <div className="max-w-7xl mx-auto">
                <Title className="text-3xl mb-6">Search Flights</Title>

                <FlightSearchForm
                    onSearch={handleSearch}
                    initialData={currentSearchParams}
                />

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

                <SearchResults searchResults={searchResults} />

                {searchResults && <BookingSummary />}
            </div>
        </main>
    )
} 