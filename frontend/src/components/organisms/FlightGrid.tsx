import { FlightCard } from '@/components/molecules/FlightCard'
import { Title } from '@/components/atoms/Typography'
import type { Flight } from '@/types/flight'
import { useSelector } from 'react-redux'
import { selectSearchParams } from '@/lib/features/searchSlice'

interface FlightGridProps {
    outboundFlights: Flight[]
    returnFlights: Flight[]
}

export function FlightGrid({ outboundFlights, returnFlights }: FlightGridProps) {
    const searchParams = useSelector(selectSearchParams);

    return (
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="space-y-2 sm:space-y-4">
                <Title className="text-sm sm:text-lg font-semibold truncate">
                    {searchParams.origin} → {searchParams.destination}
                </Title>
                <div className="grid gap-2 sm:gap-4">
                    {outboundFlights.map((flight) => (
                        <FlightCard
                            key={flight.id}
                            flight={flight}
                            type="outbound"
                            departureDate={searchParams.departureDate}
                            arrivalDate={flight.arrivalDate}
                        />
                    ))}
                </div>
            </div>

            {returnFlights.length > 0 && (
                <div className="space-y-2 sm:space-y-4">
                    <Title className="text-sm sm:text-lg font-semibold truncate">
                        {searchParams.destination} → {searchParams.origin}
                    </Title>
                    <div className="grid gap-2 sm:gap-4">
                        {returnFlights.map((flight) => (
                            <FlightCard
                                key={flight.id}
                                flight={flight}
                                type="return"
                                departureDate={searchParams.returnDate || ''}
                                arrivalDate={flight.arrivalDate || ''}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
