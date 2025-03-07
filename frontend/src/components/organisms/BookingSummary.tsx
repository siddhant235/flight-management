import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/atoms/Card'
import { TripType } from '@/types/flight'

interface BookingSummaryProps {
    onBookNow: () => void
}

export function BookingSummary({ onBookNow }: BookingSummaryProps) {
    const selectedFlights = useSelector((state: RootState) => state.selectedFlights)
    const searchParams = useSelector((state: RootState) => state.search.searchParams)
    const { user } = useSelector((state: RootState) => state.auth)

    const isRoundTrip = searchParams.tripType === TripType.ROUND_TRIP
    const totalPrice = selectedFlights.outboundFlight?.price || 0
    const returnPrice = selectedFlights.returnFlight?.price || 0
    const finalPrice = isRoundTrip ? totalPrice + returnPrice : totalPrice

    if (!user) {
        return (
            <Card className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 shadow-lg">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 mb-2">Please sign in to book flights</p>
                    <Button variant="primary" onClick={() => window.location.href = '/auth/signin'}>
                        Sign In
                    </Button>
                </div>
            </Card>
        )
    }

    if (!selectedFlights.outboundFlight) {
        return null
    }

    // For one-way trips, we only need outbound flight
    // For round trips, we need both outbound and return flights
    const isBookingReady = isRoundTrip
        ? selectedFlights.outboundFlight && selectedFlights.returnFlight
        : selectedFlights.outboundFlight

    return (
        <Card className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Outbound Flight:</span>
                            <span className="font-medium">${totalPrice}</span>
                        </div>
                        {isRoundTrip && selectedFlights.returnFlight && (
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">Return Flight:</span>
                                <span className="font-medium">${returnPrice}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span>${finalPrice}</span>
                        </div>
                        {!isBookingReady && isRoundTrip && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                                Please select return flight to continue
                            </p>
                        )}
                    </div>
                </div>
                <div className="w-full md:w-auto">
                    <Button
                        variant="primary"
                        onClick={onBookNow}
                        disabled={!isBookingReady}
                        className="w-full"
                    >
                        {!isBookingReady && isRoundTrip ? 'Select Return Flight to Continue' : 'Book Now'}
                    </Button>
                </div>
            </div>
        </Card>
    )
} 