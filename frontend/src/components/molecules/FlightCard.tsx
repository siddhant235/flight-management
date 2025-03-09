import { Card } from '@/components/atoms/Card'
import { Title, Text, Label } from '@/components/atoms/Typography'
import type { Flight } from '@/types/flight'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/lib/store'
import { setOutboundFlight, setReturnFlight } from '@/lib/features/selectedFlightsSlice'
import { formatTime, calculateDuration } from '@/utils/dateTime'

interface FlightCardProps {
    flight: Flight
    type: 'outbound' | 'return'
    departureDate: string
    arrivalDate: string
}

export function FlightCard({ flight, type, departureDate, arrivalDate }: FlightCardProps) {
    const dispatch = useDispatch();
    const selectedFlights = useSelector((state: RootState) => state.selectedFlights);
    const isSelected = type === 'outbound'
        ? selectedFlights.outboundFlight?.id === flight.id
        : selectedFlights.returnFlight?.id === flight.id;

    const handleSelect = () => {
        if (type === 'outbound') {
            dispatch(setOutboundFlight(flight));
        } else {
            dispatch(setReturnFlight(flight));
        }
    };

    return (
        <Card
            className={`cursor-pointer transition-all relative ${isSelected
                ? 'border-2 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                : 'hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md'
                }`}
            onClick={handleSelect}
        >
            {isSelected && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    ✓
                </div>
            )}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <Title className="text-lg">{flight.airline}</Title>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">{flight.flightNumber}</Text>
                </div>
                <Text className={`text-sm font-medium px-2 py-1 rounded ${isSelected
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                    : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                    {type === 'outbound' ? 'Outbound' : 'Return'}
                </Text>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <Label className="block text-sm">From</Label>
                        <Text className="font-medium">{flight.departureAirport}</Text>
                        <div className="space-y-0.5">
                            <Text className="text-sm font-medium">{formatTime(flight.departureTime)}</Text>
                            <Text className="text-xs text-gray-500">{departureDate}</Text>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center px-4">
                        <Text className="text-xs text-gray-500 mb-1">Duration</Text>
                        <div className="w-full h-px bg-gray-300 dark:bg-gray-600 relative">
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 rotate-90">✈️</div>
                        </div>
                        <Text className="text-sm font-medium mt-1">
                            {calculateDuration(flight.departureTime, flight.arrivalTime)}
                        </Text>
                    </div>

                    <div className="flex-1 text-right">
                        <Label className="block text-sm">To</Label>
                        <Text className="font-medium">{flight.arrivalAirport}</Text>
                        <div className="space-y-0.5">
                            <Text className="text-sm font-medium">{formatTime(flight.arrivalTime)}</Text>
                            <Text className="text-xs text-gray-500">{arrivalDate}</Text>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div>
                        <Label className="block text-sm">Class</Label>
                        <Text className="font-medium">{flight.seatClass}</Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-400">{flight.availableSeats} seats available</Text>
                    </div>
                    <div className="text-right">
                        <Label className="block text-sm">Price</Label>
                        <Text className={`text-lg font-bold ${isSelected
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-900 dark:text-gray-100'
                            }`}>
                            ₹{flight.price.toLocaleString()}
                        </Text>
                    </div>
                </div>
            </div>
        </Card>
    );
}
