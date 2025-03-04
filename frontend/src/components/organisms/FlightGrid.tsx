import type { Flight } from '@/lib/services/flightApi'
import { FlightCard } from '../molecules/FlightCard'
import { Title } from '@/components/atoms/Typography'

interface FlightGridProps {
    outboundFlights: Flight[]
    returnFlights?: Flight[]
}

export function FlightGrid({ outboundFlights, returnFlights }: FlightGridProps) {
    const isRoundTrip = returnFlights && returnFlights.length > 0;

    if (isRoundTrip) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <Title className="text-xl mb-4">Outbound Flights</Title>
                    <div className="space-y-4">
                        {outboundFlights.map((flight) => (
                            <FlightCard key={flight.id} flight={flight} type="outbound" />
                        ))}
                    </div>
                </div>
                <div>
                    <Title className="text-xl mb-4">Return Flights</Title>
                    <div className="space-y-4">
                        {returnFlights.map((flight) => (
                            <FlightCard key={flight.id} flight={flight} type="return" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {outboundFlights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
            ))}
        </div>
    );
}
