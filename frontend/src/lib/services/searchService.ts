import { FlightSearchFormData, TripType, CabinClass } from '@/types/flight'

export const searchService = {
    defaultValues: {
        tripType: TripType.ROUND_TRIP,
        passengers: {
            adults: 1,
            children: 0,
            infants: 0,
        },
        cabinClass: CabinClass.ECONOMY,
    } as Partial<FlightSearchFormData>,

    validateDates(departureDate: string, tripType: TripType, returnDate?: string): string | null {
        const departure = new Date(departureDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (departure < today) {
            return 'Departure date cannot be in the past'
        }

        if (tripType === TripType.ROUND_TRIP && returnDate) {
            const return_ = new Date(returnDate)
            if (return_ < departure) {
                return 'Return date must be after departure date'
            }
        }

        return null
    },

    validatePassengers(adults: number, children: number, infants: number): string | null {
        if (adults < 1) {
            return 'At least one adult is required'
        }

        if (infants > adults) {
            return 'Number of infants cannot exceed number of adults'
        }

        const totalPassengers = adults + children + infants
        if (totalPassengers > 9) {
            return 'Maximum 9 passengers allowed'
        }

        return null
    },

    async searchFlights(searchData: FlightSearchFormData) {
        // Validate dates
        const dateError = this.validateDates(
            searchData.departureDate,
            searchData.tripType,
            searchData.returnDate
        )
        if (dateError) throw new Error(dateError)

        // Validate passengers
        const passengerError = this.validatePassengers(
            searchData.passengers.adults,
            searchData.passengers.children,
            searchData.passengers.infants
        )
        if (passengerError) throw new Error(passengerError)

        // TODO: Implement actual API call
        return searchData
    }
}
