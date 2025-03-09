import { useSelector } from 'react-redux'
import { FlightCard } from '@/components/molecules/FlightCard'
import type { Flight } from '@/types/flight'
import { selectSearchParams } from '@/lib/features/searchSlice'
import { TripType } from '@/types/flight'

interface FlightGridProps {
    outboundFlights: Flight[]
    returnFlights: Flight[]
}

export function FlightGrid({ outboundFlights, returnFlights }: FlightGridProps) {
    const { tripType, departureDate, returnDate } = useSelector(selectSearchParams)
    const isRoundTrip = tripType === TripType.ROUND_TRIP

    return (
        <div className={`grid ${isRoundTrip ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
            <div>
                <h3 className="text-xl font-semibold mb-4">Outbound Flights</h3>
                <div className="space-y-4">
                    {outboundFlights.map((flight) => (
                        <FlightCard
                            key={flight.id}
                            flight={flight}
                            type="outbound"
                            departureDate={departureDate}
                            arrivalDate={departureDate}
                        />
                    ))}
                </div>
            </div>

            {isRoundTrip && (
                <div>
                    <h3 className="text-xl font-semibold mb-4">Return Flights</h3>
                    {returnFlights.length > 0 && (
                        <div className="space-y-4">
                            {returnFlights.map((flight) => (
                                <FlightCard
                                    key={flight.id}
                                    flight={flight}
                                    type="return"
                                    departureDate={returnDate}
                                    arrivalDate={returnDate}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
