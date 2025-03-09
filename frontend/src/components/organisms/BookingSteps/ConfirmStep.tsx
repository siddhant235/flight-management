import { Button } from '@/components/molecules/Button'
import type { Flight, FlightSearchFormData } from '@/types/flight'
import type { PaymentMethod } from '@/types/payment'
import { CURRENCY } from '@/lib/constants/currency'

export interface PassengerData {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    phone: string;
}

interface ConfirmStepProps {
    flights: Flight
    returnFlight?: Flight
    searchFormData: FlightSearchFormData
    passengerData: PassengerData[]
    paymentMethod: PaymentMethod | null
    onBack: () => void
    onConfirm: () => void
    isCreatingBooking: boolean
}

export function ConfirmStep({
    flights,
    returnFlight,
    searchFormData,
    passengerData,
    paymentMethod,
    onBack,
    onConfirm,
    isCreatingBooking
}: ConfirmStepProps) {
    const getPassengerType = (index: number) => {
        if (index < searchFormData.passengers.adults) return 'Adult'
        if (index < searchFormData.passengers.adults + searchFormData.passengers.children) return 'Child'
        return 'Infant'
    }

    return (
        <>
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Confirm Booking</h2>
                <div className="space-y-4 border rounded-lg p-4">
                    <div>
                        <h3 className="font-medium">Passenger Details</h3>
                        {passengerData.map((passenger, index) => (
                            passenger && (
                                <div key={index} className="mt-2">
                                    <p className="font-medium">
                                        {getPassengerType(index)} Passenger {index + 1}
                                    </p>
                                    <p>{passenger.firstName} {passenger.lastName}</p>
                                    <p>Age: {passenger.age}</p>
                                    <p>Email: {passenger.email}</p>
                                    <p>Phone: {passenger.phone}</p>
                                </div>
                            )
                        ))}
                    </div>

                    <div>
                        <h3 className="font-medium">Flight Details</h3>
                        <p><span className="font-medium">From:</span> {searchFormData.origin}</p>
                        <p><span className="font-medium">To:</span> {searchFormData.destination}</p>
                        <p><span className="font-medium">Departure Date:</span> {searchFormData.departureDate}</p>
                        {searchFormData.returnDate && (
                            <p><span className="font-medium">Return Date:</span> {searchFormData.returnDate}</p>
                        )}
                        <p><span className="font-medium">Passengers:</span> {passengerData.length}</p>
                        <p><span className="font-medium">Seat Class:</span> {searchFormData.seatClass}</p>
                    </div>

                    <div>
                        <h3 className="font-medium">Payment Summary</h3>
                        <div className="mt-2 space-y-2">
                            <div className="flex justify-between">
                                <p>Outbound Flight ({passengerData.length} x {CURRENCY.symbol}{flights.price.toFixed(2)})</p>
                                <p>{CURRENCY.symbol}{(flights.price * passengerData.length).toFixed(2)}</p>
                            </div>
                            {returnFlight && (
                                <div className="flex justify-between">
                                    <p>Return Flight ({passengerData.length} x {CURRENCY.symbol}{returnFlight.price.toFixed(2)})</p>
                                    <p>{CURRENCY.symbol}{(returnFlight.price * passengerData.length).toFixed(2)}</p>
                                </div>
                            )}
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-bold">
                                    <p>Total Amount</p>
                                    <p className="text-blue-600">
                                        {CURRENCY.symbol}{((flights.price + (returnFlight ? returnFlight.price : 0)) * passengerData.length).toFixed(2)}
                                    </p>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Total for {passengerData.length} passengers</p>
                            </div>
                        </div>
                    </div>

                    {paymentMethod && (
                        <div>
                            <h3 className="font-medium">Payment Method</h3>
                            <div className="mt-2">
                                <p className="font-medium">{paymentMethod.card_holder_name}</p>
                                <p className="text-gray-600">**** **** **** {paymentMethod.card_number.slice(-4)}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div className="max-w-2xl mx-auto flex gap-4">
                    <Button
                        onClick={onBack}
                        variant="secondary"
                        className="w-1/2"
                    >
                        Back to Payment
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isCreatingBooking || passengerData.some(p => p === undefined)}
                        className="w-1/2"
                    >
                        {isCreatingBooking ? 'Processing...' : 'Confirm Booking'}
                    </Button>
                </div>
            </div>
        </>
    )
} 