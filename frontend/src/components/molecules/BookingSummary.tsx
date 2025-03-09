import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { RootState } from '@/lib/store'
import { Text } from '@/components/atoms/Typography'
import { TripType } from '@/types/flight'
import { selectSearchParams } from '@/lib/features/searchSlice'
import { Button } from './Button'

export function BookingSummary() {
    const router = useRouter()
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

    const handleBook = () => {
        if (outboundFlight) {
            const flights = [outboundFlight.id];
            if (returnFlight) {
                flights.push(returnFlight.id);
            }
            router.push(`/book?flights=${flights.join(',')}&seatClass=${searchParams.seatClass}`);
        }
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
            <div className="container mx-auto max-w-7xl px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        {outboundFlight ? (
                            <>
                                <Text className="text-sm text-gray-600 dark:text-gray-400">
                                    {outboundFlight.airline} - {outboundFlight.flightNumber}
                                </Text>
                                {tripType === TripType.ROUND_TRIP && returnFlight && (
                                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                                        {returnFlight.airline} - {returnFlight.flightNumber}
                                    </Text>
                                )}
                                {tripType === TripType.ROUND_TRIP && !returnFlight && (
                                    <Text className="text-sm font-medium text-red-500">
                                        Please select a return flight
                                    </Text>
                                )}
                            </>
                        ) : (
                            <Text className="text-sm font-medium text-red-500 dark:text-red-400">
                                Please select flights to continue
                            </Text>
                        )}
                    </div>
                    <div className="flex items-center gap-6">
                        {outboundFlight && (
                            <div className="text-right">
                                <Text className="text-sm text-gray-600 dark:text-gray-400">Total Price</Text>
                                <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    ₹{calculateTotal().toLocaleString()}
                                </Text>
                            </div>
                        )}
                        <Button
                            onClick={handleBook}
                            disabled={!canProceed}
                            className={`${!canProceed ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600' : ''}`}
                        >
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
} 