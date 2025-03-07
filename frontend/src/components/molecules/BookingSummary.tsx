import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { Button } from '@/components/atoms/Button'
import { Text } from '@/components/atoms/Typography'
import { TripType } from '@/types/flight'
import { selectSearchParams } from '@/lib/features/searchSlice'

interface BookingSummaryProps {
    onBook: () => void
}

export function BookingSummary({ onBook }: BookingSummaryProps) {
    const selectedFlights = useSelector((state: RootState) => state.selectedFlights);
    const searchParams = useSelector(selectSearchParams);
    const { outboundFlight, returnFlight } = selectedFlights;
    const tripType = searchParams.tripType;

    const calculateTotal = () => {
        let total = 0;
        if (outboundFlight) total += outboundFlight.price;
        if (returnFlight) total += returnFlight.price;
        return total;
    };

    const canProceed = tripType === TripType.ONE_WAY
        ? !!outboundFlight
        : !!outboundFlight && !!returnFlight;

    if (!outboundFlight) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
            <div className="container mx-auto max-w-7xl px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Text className="text-sm text-gray-600 dark:text-gray-400">
                            {outboundFlight.airline} - {outboundFlight.flightNumber}
                        </Text>
                        {tripType === TripType.ROUND_TRIP && returnFlight && (
                            <Text className="text-sm text-gray-600 dark:text-gray-400">
                                {returnFlight.airline} - {returnFlight.flightNumber}
                            </Text>
                        )}
                        {tripType === TripType.ROUND_TRIP && !returnFlight && (
                            <Text className="text-sm text-red-500">
                                Please select a return flight
                            </Text>
                        )}
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <Text className="text-sm text-gray-600 dark:text-gray-400">Total Price</Text>
                            <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                ₹{calculateTotal().toLocaleString()}
                            </Text>
                        </div>
                        <Button onClick={onBook} disabled={!canProceed}>
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
} 