import { PaymentMethods } from '@/components/organisms/PaymentMethods'
import { Button } from '@/components/molecules/Button'
import type { Flight } from '@/types/flight'
import type { PaymentMethodFormData } from '@/types/payment'
import { CURRENCY } from '@/lib/constants/currency'
import type { PaymentMethod } from '@/types/payment'
interface PaymentStepProps {
    flights: Flight
    returnFlight?: Flight
    passengerCount: number
    paymentMethods: PaymentMethod[]
    selectedPaymentMethodId: string | null
    onAddPayment: (data: PaymentMethodFormData) => Promise<void>
    onDeletePayment: (id: string) => Promise<void>
    onSelectPayment: (id: string) => void
    onBack: () => void
    onContinue: () => void
}

export function PaymentStep({
    flights,
    returnFlight,
    passengerCount,
    paymentMethods,
    selectedPaymentMethodId,
    onAddPayment,
    onDeletePayment,
    onSelectPayment,
    onBack,
    onContinue
}: PaymentStepProps) {
    return (
        <>
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Select Payment Method</h2>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <p className="text-gray-600 dark:text-gray-400">Price per passenger</p>
                            <p className="font-medium">{CURRENCY.symbol}{(flights.price + (returnFlight ? returnFlight.price : 0)).toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-600 dark:text-gray-400">Number of passengers</p>
                            <p className="font-medium">× {passengerCount}</p>
                        </div>
                        <div className="border-t border-blue-200 dark:border-blue-800 pt-2 mt-2">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold">Total Amount</p>
                                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                    {CURRENCY.symbol}{((flights.price + (returnFlight ? returnFlight.price : 0)) * passengerCount).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <PaymentMethods
                    paymentMethods={paymentMethods}
                    onAdd={onAddPayment}
                    onDelete={onDeletePayment}
                    onSetDefault={onSelectPayment}
                    selectedPaymentMethodId={selectedPaymentMethodId}
                />
            </div>
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div className="max-w-2xl mx-auto flex gap-4">
                    <Button
                        onClick={onBack}
                        variant="secondary"
                        className="w-1/2"
                    >
                        Back to Passengers
                    </Button>
                    <Button
                        onClick={onContinue}
                        disabled={!selectedPaymentMethodId}
                        className="w-1/2"
                    >
                        Continue to Confirm
                    </Button>
                </div>
            </div>
        </>
    )
} 