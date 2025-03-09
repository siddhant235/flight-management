'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCreateBookingMutation } from '@/lib/services/bookingApi'
import { useGetProfileQuery, useUpdateProfileMutation } from '@/lib/services/profileApi'
import { useGetFlightByIdQuery } from '@/lib/services/flightApi'
import type { Passenger } from '@/types/booking'
import type { PaymentMethodFormData } from '@/types/payment'
import { useSelector } from 'react-redux'
import { selectSearchParams } from '@/lib/features/searchSlice'
import { Spinner } from '@/components/atoms/Spinner'
import { skipToken } from '@reduxjs/toolkit/query'
import { SeatClassType } from '@/types/flight'
import { toast, Toaster } from 'sonner'
import { PassengerStep } from '@/components/organisms/BookingSteps/PassengerStep'
import { PaymentStep } from '@/components/organisms/BookingSteps/PaymentStep'
import { ConfirmStep, PassengerData } from '@/components/organisms/BookingSteps/ConfirmStep'

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

    const handleConfirmBooking = async () => {
        if (passengerData.some(p => p === undefined) || !selectedPaymentMethodId || !flights) return

        try {
            const totalAmount = (flights.price + (returnFlight ? returnFlight.price : 0)) * passengerData.length;
            const response = await createBooking({
                outboundFlight: {
                    flightId: flights.id,
                    seatClass: searchFormData.seatClass,
                    departureDate: searchFormData.departureDate,
                    departureTime: flights.departureTime,
                    arrivalTime: flights.arrivalTime,
                    arrivalDate: searchFormData.departureDate,
                },
                returnFlight: returnFlight ? {
                    flightId: returnFlight.id,
                    seatClass: searchFormData.seatClass,
                    departureDate: searchFormData.returnDate || '',
                    departureTime: returnFlight.departureTime,
                    arrivalTime: returnFlight.arrivalTime,
                    arrivalDate: searchFormData.returnDate || '',
                } : undefined,
                passengers: passengerData.filter((p): p is Omit<Passenger, 'id'> => p !== undefined),
                paymentMethodId: selectedPaymentMethodId,
                totalAmount,
            }).unwrap()

            toast.success('Booking confirmed successfully!', {
                description: `Booking reference: ${response.bookingReference}`
            })

            // Redirect to bookings page after a short delay
            setTimeout(() => {
                router.push('/bookings')
            }, 2000)
        } catch (error: unknown) {
            console.error('Booking failed:', error)
            const errorMessage = error && typeof error === 'object' && 'data' in error
                ? (error.data as { message?: string })?.message
                : 'Please try again later'

            toast.error('Failed to confirm booking', {
                description: errorMessage
            })
        }
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

            {step === 'passenger' && (
                <PassengerStep
                    flights={flights}
                    returnFlight={returnFlight}
                    passengerData={passengerData}
                    searchFormData={searchFormData}
                    onPassengerSubmit={handlePassengerSubmit}
                    onPassengerDelete={handlePassengerDelete}
                    onContinue={() => setStep('payment')}
                    isCreatingBooking={isCreatingBooking}
                />
            )}

            {step === 'payment' && (
                <PaymentStep
                    flights={flights}
                    returnFlight={returnFlight}
                    passengerCount={passengerData.length}
                    paymentMethods={profile?.payment_methods || []}
                    selectedPaymentMethodId={selectedPaymentMethodId}
                    onAddPayment={handleAddPaymentMethod}
                    onDeletePayment={handleDeletePaymentMethod}
                    onSelectPayment={setSelectedPaymentMethodId}
                    onBack={() => setStep('passenger')}
                    onContinue={() => setStep('confirm')}
                />
            )}

            {step === 'confirm' && (
                <ConfirmStep
                    flights={flights}
                    returnFlight={returnFlight}
                    searchFormData={searchFormData}
                    passengerData={passengerData as unknown as PassengerData[]}
                    paymentMethod={profile?.payment_methods.find(pm => pm.id === selectedPaymentMethodId) || null}
                    onBack={() => setStep('payment')}
                    onConfirm={handleConfirmBooking}
                    isCreatingBooking={isCreatingBooking}
                />
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
            <Toaster richColors position="top-center" />
        </Suspense>
    )
} 