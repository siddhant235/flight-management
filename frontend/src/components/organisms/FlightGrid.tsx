import { FlightCard } from '@/components/molecules/FlightCard'
import type { Flight } from '@/types/flight'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { TripType } from '@/types/flight'

interface FlightGridProps {
    outboundFlights: Flight[]
    returnFlights: Flight[]
}

export function FlightGrid({ outboundFlights, returnFlights }: FlightGridProps) {
    const searchParams = useSelector((state: RootState) => state.search.searchParams)
    const isRoundTrip = searchParams.tripType === TripType.ROUND_TRIP
    console.log(outboundFlights, "OUTBOUNF")
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="text-xl font-semibold mb-4">Outbound Flights</h3>
                <div className="space-y-4">
                    {outboundFlights.map((flight) => (
                        <FlightCard
                            key={flight.id}
                            flight={flight}
                            type="outbound"
                            departureDate={searchParams.departureDate}
                            arrivalDate={searchParams.departureDate}
                        />
                    ))}
                </div>
            </div>
            {isRoundTrip && (
                <div>
                    <h3 className="text-xl font-semibold mb-4">Return Flights</h3>
                    <div className="space-y-4">
                        {returnFlights.map((flight) => (
                            <FlightCard
                                key={flight.id}
                                flight={flight}
                                type="return"
                                departureDate={searchParams.returnDate}
                                arrivalDate={searchParams.returnDate}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
