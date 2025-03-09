import { Card } from '@/components/atoms/Card'
import { Title, Text } from '@/components/atoms/Typography'
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
            className={`cursor-pointer transition-all relative p-1.5 sm:p-4 ${isSelected
                ? 'border-2 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                : 'hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md'
                }`}
            onClick={handleSelect}
        >
            {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white rounded-full w-3.5 h-3.5 sm:w-6 sm:h-6 flex items-center justify-center text-[8px] sm:text-base">
                    ✓
                </div>
            )}
            <div className="mb-1 sm:mb-4">
                <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                        <Title className="text-[11px] sm:text-base truncate max-w-[80px] sm:max-w-none">{flight.airline}</Title>
                        <Text className="text-[9px] sm:text-xs text-gray-600 dark:text-gray-400">{flight.flightNumber}</Text>
                    </div>
                    <Text className={`text-xs sm:text-lg font-bold ml-1 sm:ml-2 ${isSelected
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-gray-100'
                        }`}>
                        ₹{flight.price.toLocaleString()}
                    </Text>
                </div>
                <Text className="text-[9px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">{flight.seatClass}</Text>
            </div>

            <div className="space-y-1 sm:space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <Text className="text-[10px] sm:text-sm font-medium truncate">{flight.departureAirport}</Text>
                        <div>
                            <Text className="text-[10px] sm:text-sm font-medium">{formatTime(flight.departureTime)}</Text>
                            <Text className="text-[9px] sm:text-xs text-gray-500 truncate">{departureDate}</Text>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center px-1 sm:px-4 mx-1 sm:mx-2">
                        <Text className="text-[8px] sm:text-xs text-gray-500">Duration</Text>
                        <div className="w-full h-px bg-gray-300 dark:bg-gray-600" />
                        <Text className="text-[8px] sm:text-sm font-medium mt-0.5">
                            {calculateDuration(flight.departureTime, flight.arrivalTime)}
                        </Text>
                    </div>

                    <div className="flex-1 min-w-0 text-right">
                        <Text className="text-[10px] sm:text-sm font-medium truncate">{flight.arrivalAirport}</Text>
                        <div>
                            <Text className="text-[10px] sm:text-sm font-medium">{formatTime(flight.arrivalTime)}</Text>
                            <Text className="text-[9px] sm:text-xs text-gray-500 truncate">{arrivalDate}</Text>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end items-center pt-0.5 sm:pt-2 text-[9px] sm:text-xs text-gray-600 dark:text-gray-400">
                    {flight.availableSeats} seats left
                </div>
            </div>
        </Card>
    );
}
