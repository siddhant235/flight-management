'use client'

import { Suspense } from 'react'
import { Spinner } from '@/components/atoms/Spinner'
import { ErrorMessage } from '@/components/atoms/ErrorMessage'
import { FlightGrid } from '@/components/organisms/FlightGrid'
import { Title } from '@/components/atoms/Typography'
import { FlightSearchForm } from '@/components/organisms/FlightSearchForm'
import { useSearchFlightsMutation } from '@/lib/services/flightApi'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { FlightSearchFormData } from '@/types/flight'
import { BookingSummary } from '@/components/molecules/BookingSummary'
import { useDispatch, useSelector } from 'react-redux'
import { clearSelectedFlights } from '@/lib/features/selectedFlightsSlice'
import { updateSearchParams, selectIsSearching, selectSearchParams } from '@/lib/features/searchSlice'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { TripType, SeatClassType } from '@/types/flight'

function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const [searchFlights, { data: searchResults, error: searchError }] = useSearchFlightsMutation()
  const isSearching = useSelector(selectIsSearching)
  const currentSearchParams = useSelector(selectSearchParams)

  // Initialize search params from URL on page load
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const formData: Partial<FlightSearchFormData> = {
      tripType: (params.get('tripType') as TripType) || TripType.ROUND_TRIP,
      origin: params.get('origin') || '',
      destination: params.get('destination') || '',
      departureDate: params.get('departureDate') || '',
      returnDate: params.get('returnDate') || '',
      seatClass: (params.get('seatClass') as SeatClassType) || SeatClassType.ECONOMY,
      passengers: {
        adults: parseInt(params.get('adults') || '1'),
        children: parseInt(params.get('children') || '0'),
        infants: parseInt(params.get('infants') || '0'),
      }
    }
    dispatch(updateSearchParams(formData))
  }, [dispatch, searchParams])

  const handleSearch = (formData: FlightSearchFormData) => {
    dispatch(clearSelectedFlights())
    dispatch(updateSearchParams(formData))
    searchFlights(formData)

    // Update URL with search parameters
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

    // Update URL without triggering a page reload
    router.push(`?${params.toString()}`, { scroll: false })
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
        <FlightSearchForm
          onSearch={handleSearch}
          initialData={currentSearchParams}
        />

        {isSearching && (
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

        <BookingSummary />
      </div>
    </main>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
