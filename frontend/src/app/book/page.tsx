'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PassengerForm } from '@/components/organisms/PassengerForm'
import { PaymentMethods } from '@/components/organisms/PaymentMethods'
import { useCreateBookingMutation } from '@/lib/services/bookingApi'
import { useGetProfileQuery } from '@/lib/services/profileApi'
import { useGetFlightByIdQuery } from '@/lib/services/flightApi'
import { Button } from '@/components/molecules/Button'
import type { Passenger } from '@/types/booking'
import { useSelector } from 'react-redux'
import { selectSearchParams } from '@/lib/features/searchSlice'
import { Spinner } from '@/components/atoms/Spinner'

function BookingContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const flightIds = searchParams.get('flights')?.split(',') || []
    const searchFormData = useSelector(selectSearchParams)
    console.log('searchFormData', searchFormData)
    const [step, setStep] = useState<'passenger' | 'payment' | 'confirm'>('passenger')
    const [passengerData, setPassengerData] = useState<Omit<Passenger, 'id'>[]>([])
    const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0)
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null)

    const { data: profile, isLoading: isLoadingProfile } = useGetProfileQuery()
    const { data: flights, isLoading: isLoadingFlights } = useGetFlightByIdQuery(flightIds[0])
    const { data: returnFlight } = useGetFlightByIdQuery(flightIds[1] || '')
    const [createBooking, { isLoading: isCreatingBooking }] = useCreateBookingMutation()

    const totalPassengers = searchFormData.passengers.adults + searchFormData.passengers.children + searchFormData.passengers.infants

    const handlePassengerSubmit = (data: Omit<Passenger, 'id'>) => {
        const newPassengerData = [...passengerData]
        newPassengerData[currentPassengerIndex] = data
        setPassengerData(newPassengerData)

        if (currentPassengerIndex < totalPassengers - 1) {
            setCurrentPassengerIndex(currentPassengerIndex + 1)
        } else {
            setStep('payment')
        }
    }

    const handlePaymentSelect = async (paymentMethodId: string) => {
        setSelectedPaymentMethodId(paymentMethodId)
        setStep('confirm')
    }

    const handleConfirmBooking = async () => {
        if (passengerData.length !== totalPassengers || !selectedPaymentMethodId || !flights) return

        try {
            const totalAmount = flights.price + (returnFlight?.price || 0)
            await createBooking({
                flightId: flights.id,
                passengers: passengerData,
                paymentMethodId: selectedPaymentMethodId,
                totalAmount,
            }).unwrap()

            router.push('/bookings')
        } catch (error) {
            console.error('Booking failed:', error)
        }
    }

    if (isLoadingProfile || isLoadingFlights) {
        return <div>Loading...</div>
    }

    if (!flights) {
        return <div>Flight not found</div>
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Complete Your Booking</h1>
                <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'passenger' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}>
                        1
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}>
                        2
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'confirm' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}>
                        3
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="border rounded-lg p-4 space-y-2">
                    <h2 className="text-xl font-semibold">Outbound Flight</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">{flights.airline} - {flights.flightNumber}</p>
                            <p className="text-sm text-gray-500">{flights.departureTime} - {flights.arrivalTime}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-medium">${flights.price}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <p><span className="font-medium">From:</span> {flights.departureAirport}</p>
                        <p><span className="font-medium">To:</span> {flights.arrivalAirport}</p>
                    </div>
                </div>

                {returnFlight && (
                    <div className="border rounded-lg p-4 space-y-2">
                        <h2 className="text-xl font-semibold">Return Flight</h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{returnFlight.airline} - {returnFlight.flightNumber}</p>
                                <p className="text-sm text-gray-500">{returnFlight.departureTime} - {returnFlight.arrivalTime}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">${returnFlight.price}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <p><span className="font-medium">From:</span> {returnFlight.departureAirport}</p>
                            <p><span className="font-medium">To:</span> {returnFlight.arrivalAirport}</p>
                        </div>
                    </div>
                )}
            </div>

            {step === 'passenger' && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Passenger Information</h2>
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">
                            Passenger {currentPassengerIndex + 1} of {totalPassengers}
                        </p>
                        {currentPassengerIndex < searchFormData.passengers.adults && (
                            <p className="text-sm font-medium">Adult Passenger</p>
                        )}
                        {currentPassengerIndex >= searchFormData.passengers.adults &&
                            currentPassengerIndex < searchFormData.passengers.adults + searchFormData.passengers.children && (
                                <p className="text-sm font-medium">Child Passenger</p>
                            )}
                        {currentPassengerIndex >= searchFormData.passengers.adults + searchFormData.passengers.children && (
                            <p className="text-sm font-medium">Infant Passenger</p>
                        )}
                    </div>
                    <PassengerForm
                        onSubmit={handlePassengerSubmit}
                        isLoading={isCreatingBooking}
                    />
                </div>
            )}

            {step === 'payment' && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Select Payment Method</h2>
                    <PaymentMethods
                        paymentMethods={profile?.payment_methods || []}
                        onAdd={async () => { }}
                        onDelete={async () => { }}
                        onSetDefault={handlePaymentSelect}
                    />
                </div>
            )}

            {step === 'confirm' && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Confirm Booking</h2>
                    <div className="space-y-4 border rounded-lg p-4">
                        <div>
                            <h3 className="font-medium">Passenger Details</h3>
                            {passengerData.map((passenger, index) => (
                                <div key={index} className="mt-2">
                                    <p className="font-medium">
                                        {index < searchFormData.passengers.adults ? 'Adult' :
                                            index < searchFormData.passengers.adults + searchFormData.passengers.children ? 'Child' : 'Infant'} Passenger {index + 1}
                                    </p>
                                    <p>{passenger.firstName} {passenger.lastName}</p>
                                    <p>Age: {passenger.age}</p>
                                    <p>Email: {passenger.email}</p>
                                    <p>Phone: {passenger.phone}</p>
                                </div>
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
                            <p><span className="font-medium">Passengers:</span> {totalPassengers}</p>
                            <p><span className="font-medium">Seat Class:</span> {searchFormData.seatClass}</p>
                        </div>

                        <div>
                            <h3 className="font-medium">Payment Method</h3>
                            <p>
                                {profile?.payment_methods.find(
                                    (pm: { id: string; card_number: string }) => pm.id === selectedPaymentMethodId
                                )?.card_number.slice(-4)}
                            </p>
                        </div>

                        <Button
                            onClick={handleConfirmBooking}
                            disabled={isCreatingBooking || passengerData.length !== totalPassengers}
                            className="w-full"
                        >
                            {isCreatingBooking ? 'Processing...' : 'Confirm Booking'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function BookingPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen">
                <Spinner />
            </div>
        }>
            <BookingContent />
        </Suspense>
    )
} 