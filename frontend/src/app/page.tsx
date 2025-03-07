'use client'

import { Spinner } from '@/components/atoms/Spinner'
import { ErrorMessage } from '@/components/atoms/ErrorMessage'
import { FlightGrid } from '@/components/organisms/FlightGrid'
import { Title } from '@/components/atoms/Typography'
import { FlightSearchForm } from '@/components/organisms/FlightSearchForm'
import { useSearchFlightsMutation } from '@/lib/services/flightApi'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { FlightSearchFormData } from '@/types/flight'
import { BookingSummary } from '@/components/molecules/BookingSummary'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { clearSelectedFlights } from '@/lib/features/selectedFlightsSlice'
import { updateSearchParams } from '@/lib/features/searchSlice'

export default function ScanFlightsPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [searchFlights, { data: searchResults, isLoading, error: searchError }] = useSearchFlightsMutation()

  const handleSearch = (formData: FlightSearchFormData) => {
    dispatch(clearSelectedFlights())
    dispatch(updateSearchParams(formData))
    searchFlights(formData)
  }

  const handleBook = () => {
    router.push('/booking')
  }

  const getErrorMessage = (error: FetchBaseQueryError | undefined) => {
    if (!error) return null
    if ('data' in error && typeof error.data === 'object' && error.data && 'error' in error.data) {
      return error.data.error as string
    }
    return "Error searching flights"
  }

  const errorMessage = getErrorMessage(searchError as FetchBaseQueryError)

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen dark:bg-gray-900 pb-24">
      <div className="max-w-7xl mx-auto">
        <Title className="text-3xl mb-6">Search Flights</Title>
        <FlightSearchForm onSearch={handleSearch} />

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Spinner />
          </div>
        )}

        {errorMessage && (
          <div className="mt-4">
            <ErrorMessage message={errorMessage} />
          </div>
        )}

        {searchResults && (searchResults.outboundFlights.length > 0 || searchResults.returnFlights.length > 0) && (
          <div className="mt-8">
            <Title className="text-2xl mb-6">Available Flights</Title>
            <FlightGrid
              outboundFlights={searchResults.outboundFlights}
              returnFlights={searchResults.returnFlights}
            />
          </div>
        )}

        <BookingSummary onBook={handleBook} />
      </div>
    </main>
  )
}
