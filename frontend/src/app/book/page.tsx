'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CollapsiblePassengerForm } from '@/components/organisms/CollapsiblePassengerForm'
import { PaymentMethods } from '@/components/organisms/PaymentMethods'
import { useCreateBookingMutation } from '@/lib/services/bookingApi'
import { useGetProfileQuery, useUpdateProfileMutation } from '@/lib/services/profileApi'
import { useGetFlightByIdQuery } from '@/lib/services/flightApi'
import { Button } from '@/components/molecules/Button'
import type { Passenger } from '@/types/booking'
import type { PaymentMethodFormData } from '@/types/payment'
import { useSelector } from 'react-redux'
import { selectSearchParams } from '@/lib/features/searchSlice'
import { Spinner } from '@/components/atoms/Spinner'
import { skipToken } from '@reduxjs/toolkit/query'
import { SeatClassType } from '@/types/flight'
import { CURRENCY } from '@/lib/constants/currency'

function BookingContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const flightIds = searchParams.get('flights')?.split(',') || []
    const searchFormData = useSelector(selectSearchParams)
    const [step, setStep] = useState<'passenger' | 'payment' | 'confirm'>('passenger')
    const [passengerData, setPassengerData] = useState<(Omit<Passenger, 'id'> | undefined)[]>(
        Array(searchFormData.passengers.adults + searchFormData.passengers.children + searchFormData.passengers.infants).fill(undefined)
    )
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null)
    console.log("Search form data", searchFormData)
    const { data: profile, isLoading: isLoadingProfile } = useGetProfileQuery()
    const { data: flights, isLoading: isLoadingFlights } = useGetFlightByIdQuery({
        id: flightIds[0],
        seatClass: searchParams.get('seatClass') as SeatClassType || searchFormData.seatClass
    })
    const { data: returnFlight } = useGetFlightByIdQuery(
        flightIds[1] ? {
            id: flightIds[1],
            seatClass: searchParams.get('seatClass') as SeatClassType || searchFormData.seatClass
        } : skipToken
    )
    const [createBooking, { isLoading: isCreatingBooking }] = useCreateBookingMutation()
    const [updateProfile] = useUpdateProfileMutation()

    const handlePassengerSubmit = (data: Omit<Passenger, 'id'>, index: number) => {
        const newPassengerData = [...passengerData]
        newPassengerData[index] = data
        setPassengerData(newPassengerData)
    }

    const handlePassengerDelete = (index: number) => {
        const newPassengerData = [...passengerData]
        newPassengerData[index] = undefined
        setPassengerData(newPassengerData)
    }

    const handleContinueToPayment = () => {
        if (passengerData.every(p => p !== undefined)) {
            setStep('payment')
        }
    }

    const handleAddPaymentMethod = async (data: PaymentMethodFormData) => {
        try {
            if (!profile) return;

            const paymentMethods = profile.payment_methods || [];
            const newPaymentMethod = {
                id: crypto.randomUUID(),
                type: 'CREDIT_CARD' as const,
                card_number: data.card_number,
                card_holder_name: data.card_holder_name,
                expiry_date: data.expiry_date,
                is_default: data.is_default
            };

            await updateProfile({
                ...profile,
                payment_methods: [...paymentMethods, newPaymentMethod]
            }).unwrap();
        } catch (error) {
            console.error('Failed to add payment method:', error);
            throw error;
        }
    }

    const handleDeletePaymentMethod = async (id: string) => {
        try {
            if (!profile) return;

            const paymentMethods = profile.payment_methods || [];
            const updatedPaymentMethods = paymentMethods.filter(method => method.id !== id);

            await updateProfile({
                ...profile,
                payment_methods: updatedPaymentMethods
            }).unwrap();

            if (selectedPaymentMethodId === id) {
                setSelectedPaymentMethodId(null);
            }
        } catch (error) {
            console.error('Failed to delete payment method:', error);
            throw error;
        }
    }

    const handlePaymentSelect = async (id: string) => {
        try {
            if (!profile) return;

            const paymentMethods = profile.payment_methods || [];
            const updatedPaymentMethods = paymentMethods.map(method => ({
                ...method,
                is_default: method.id === id
            }));

            await updateProfile({
                ...profile,
                payment_methods: updatedPaymentMethods
            }).unwrap();

            setSelectedPaymentMethodId(id);
            setStep('confirm');
        } catch (error) {
            console.error('Failed to set default payment method:', error);
        }
    }

    const handleConfirmBooking = async () => {
        if (passengerData.some(p => p === undefined) || !selectedPaymentMethodId || !flights) return

        try {
            const totalAmount = flights.price +
                (returnFlight ? returnFlight.price : 0)
            await createBooking({
                flightId: flights.id,
                passengers: passengerData.filter((p): p is Omit<Passenger, 'id'> => p !== undefined),
                paymentMethodId: selectedPaymentMethodId,
                totalAmount,
                seatClass: searchFormData.seatClass
            }).unwrap()

            router.push('/bookings')
        } catch (error) {
            console.error('Booking failed:', error)
        }
    }

    const getPassengerType = (index: number) => {
        if (index < searchFormData.passengers.adults) return 'Adult'
        if (index < searchFormData.passengers.adults + searchFormData.passengers.children) return 'Child'
        return 'Infant'
    }

    if (isLoadingProfile || isLoadingFlights) {
        return <div>Loading...</div>
    }

    if (!flights) {
        return <div>Flight not found</div>
    }

    return (
        <div className="max-w-2xl mx-auto p-6 pb-24 space-y-8 relative min-h-screen">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Complete Your Booking</h1>
                <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'passenger'
                        ? 'bg-blue-500 text-white dark:text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                        1
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment'
                        ? 'bg-blue-500 text-white dark:text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                        2
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'confirm'
                        ? 'bg-blue-500 text-white dark:text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                        3
                    </div>
                </div>
            </div>
            {/* {console.log(flights)} */}
            <div className="space-y-4">
                <div className="border rounded-lg p-4 space-y-2">
                    <h2 className="text-xl font-semibold">Outbound Flight</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">{flights.airline} - {flights.flightNumber}</p>
                            <p className="text-sm text-gray-500">{flights.departureTime} - {flights.arrivalTime}</p>
                            <p className="text-sm text-gray-500">Date: {searchFormData.departureDate}</p>
                            <p className="text-sm text-gray-500">Class: {searchFormData.seatClass}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-medium">
                                {CURRENCY.symbol}{flights.price.toFixed(2)}
                            </p>
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
                                <p className="text-sm text-gray-500">Date: {searchFormData.returnDate}</p>
                                <p className="text-sm text-gray-500">Class: {searchFormData.seatClass}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">
                                    {CURRENCY.symbol}{returnFlight.price.toFixed(2)}
                                </p>
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
                <>
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Passenger Information</h2>
                        <div className="space-y-4">
                            {passengerData.map((passenger, index) => (
                                <CollapsiblePassengerForm
                                    key={index}
                                    index={index}
                                    type={getPassengerType(index)}
                                    data={passenger}
                                    onSubmit={handlePassengerSubmit}
                                    onDelete={handlePassengerDelete}
                                    isLoading={isCreatingBooking}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                        <div className="max-w-2xl mx-auto">
                            <Button
                                onClick={handleContinueToPayment}
                                disabled={passengerData.some(p => p === undefined)}
                                className="w-full"
                            >
                                Continue to Payment
                            </Button>
                        </div>
                    </div>
                </>
            )}

            {step === 'payment' && (
                <>
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Select Payment Method</h2>
                        <PaymentMethods
                            paymentMethods={profile?.payment_methods || []}
                            onAdd={handleAddPaymentMethod}
                            onDelete={handleDeletePaymentMethod}
                            onSetDefault={handlePaymentSelect}
                        />
                    </div>
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                        <div className="max-w-2xl mx-auto flex gap-4">
                            <Button
                                onClick={() => setStep('passenger')}
                                variant="secondary"
                                className="w-1/2"
                            >
                                Back to Passengers
                            </Button>
                            <Button
                                onClick={() => setStep('confirm')}
                                disabled={!selectedPaymentMethodId}
                                className="w-1/2"
                            >
                                Continue to Confirm
                            </Button>
                        </div>
                    </div>
                </>
            )}

            {step === 'confirm' && (
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
                                <h3 className="font-medium">Payment Method</h3>
                                <p>
                                    {profile?.payment_methods.find(
                                        (pm: { id: string; card_number: string }) => pm.id === selectedPaymentMethodId
                                    )?.card_number.slice(-4)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                        <div className="max-w-2xl mx-auto flex gap-4">
                            <Button
                                onClick={() => setStep('payment')}
                                variant="secondary"
                                className="w-1/2"
                            >
                                Back to Payment
                            </Button>
                            <Button
                                onClick={handleConfirmBooking}
                                disabled={isCreatingBooking || passengerData.some(p => p === undefined)}
                                className="w-1/2"
                            >
                                {isCreatingBooking ? 'Processing...' : 'Confirm Booking'}
                            </Button>
                        </div>
                    </div>
                </>
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