
import { Card } from '@/components/atoms/Card'
import { Title, Text, Label } from '@/components/atoms/Typography'
import type { Flight } from '@/types/flight'
interface FlightCardProps {
    flight: Flight
    type?: 'outbound' | 'return'
}

export function FlightCard({ flight, type }: FlightCardProps) {
    console.log(flight, type)
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <Card className={type ? `border-l-4 ${type === 'outbound' ? 'border-l-blue-500' : 'border-l-green-500'}` : ''}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <Title className="text-lg">{flight.airline}</Title>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">{flight.flightNumber}</Text>
                </div>
                {type && (
                    <Text className="text-sm font-medium px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
                        {type === 'outbound' ? 'Outbound' : 'Return'}
                    </Text>
                )}
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <div>
                        <Label className="block text-sm">From</Label>
                        <Text className="font-medium">{flight.departureAirport}</Text>
                        <Text className="text-sm">{formatTime(flight.departureTime)}</Text>
                    </div>
                    <div className="text-right">
                        <Label className="block text-sm">To</Label>
                        <Text className="font-medium">{flight.arrivalAirport}</Text>
                        <Text className="text-sm">{formatTime(flight.arrivalTime)}</Text>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div>
                        <Label className="block text-sm">Class</Label>
                        <Text className="font-medium">{flight.seatClass}</Text>
                        <Text className="text-sm">{flight.availableSeats} seats available</Text>
                    </div>
                    <div className="text-right">
                        <Label className="block text-sm">Price</Label>
                        <Text className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            ₹{flight.price.toLocaleString()}
                        </Text>
                    </div>
                </div>
            </div>
        </Card>
    )
}
