import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FlightSearchFormData, TripType, SeatClassType } from '@/types/flight'
import { searchService } from '@/lib/services/searchService'

// Zod schema for form validation
const searchSchema = z.object({
    tripType: z.nativeEnum(TripType),
    origin: z.string().min(1, 'Origin is required'),
    destination: z.string().min(1, 'Destination is required'),
    departureDate: z.string().min(1, 'Departure date is required'),
    returnDate: z.string().optional(),
    passengers: z.object({
        adults: z.number().min(1, 'At least one adult is required'),
        children: z.number().min(0),
        infants: z.number().min(0),
    }),
    seatClass: z.nativeEnum(SeatClassType),
}) satisfies z.ZodType<FlightSearchFormData>

export function useFlightSearch() {
    const [isSearching, setIsSearching] = useState(false)
    const [searchError, setSearchError] = useState<string | null>(null)

    const form = useForm<FlightSearchFormData>({
        defaultValues: searchService.defaultValues,
        resolver: zodResolver(searchSchema),
    })

    const handleSearch = async (data: FlightSearchFormData) => {
        try {
            setIsSearching(true)
            setSearchError(null)
            await searchService.searchFlights(data)
        } catch (error) {
            setSearchError(error instanceof Error ? error.message : 'An error occurred')
        } finally {
            setIsSearching(false)
        }
    }

    return {
        form,
        isSearching,
        searchError,
        handleSearch,
    }
}
