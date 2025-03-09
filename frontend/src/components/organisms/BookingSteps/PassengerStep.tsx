import { CollapsiblePassengerForm } from '@/components/organisms/CollapsiblePassengerForm'
import { Button } from '@/components/molecules/Button'
import { FlightSummary } from './FlightSummary'
import type { Passenger } from '@/types/booking'
import type { Flight, FlightSearchFormData } from '@/types/flight'

interface PassengerStepProps {
    flights: Flight
    returnFlight?: Flight
    passengerData: (Omit<Passenger, 'id'> | undefined)[]
    searchFormData: FlightSearchFormData
    onPassengerSubmit: (data: Omit<Passenger, 'id'>, index: number) => void
    onPassengerDelete: (index: number) => void
    onContinue: () => void
    isCreatingBooking: boolean
}

export function PassengerStep({
    flights,
    returnFlight,
    passengerData,
    searchFormData,
    onPassengerSubmit,
    onPassengerDelete,
    onContinue,
    isCreatingBooking
}: PassengerStepProps) {
    const getPassengerType = (index: number) => {
        if (index < searchFormData.passengers.adults) return 'Adult'
        if (index < searchFormData.passengers.adults + searchFormData.passengers.children) return 'Child'
        return 'Infant'
    }

    return (
        <>
            <div className="space-y-4">
                <FlightSummary
                    flights={flights}
                    returnFlight={returnFlight}
                    searchFormData={searchFormData}
                    passengerCount={passengerData.length}
                />

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Passenger Information</h2>
                    <div className="space-y-4">
                        {passengerData.map((passenger, index) => (
                            <CollapsiblePassengerForm
                                key={index}
                                index={index}
                                type={getPassengerType(index)}
                                data={passenger}
                                onSubmit={onPassengerSubmit}
                                onDelete={onPassengerDelete}
                                isLoading={isCreatingBooking}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div className="max-w-2xl mx-auto">
                    <Button
                        onClick={onContinue}
                        disabled={passengerData.some(p => p === undefined)}
                        className="w-full"
                    >
                        Continue to Payment
                    </Button>
                </div>
            </div>
        </>
    )
} 