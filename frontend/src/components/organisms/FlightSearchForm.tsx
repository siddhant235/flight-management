'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Select, RadioGroup } from '@/components/atoms/FormElements'
import { PassengerCounter } from '@/components/molecules/PassengerCounter'
import { AirportSelect } from '@/components/molecules/AirportSelect'
import { SeatClassType, TripType } from '@/types/flight'
import { Card } from '@/components/atoms/Card'
import { ErrorMessage } from '@/components/atoms/ErrorMessage'
import type { FlightSearchFormData } from '@/types/flight'
import { searchSchema } from '@/lib/validations/searchSchema'

const SEAT_CLASS_OPTIONS = Object.values(SeatClassType).map(value => ({
    value,
    label: value,
}))

interface FlightSearchFormProps {
    onSearch: (data: FlightSearchFormData) => void
    initialData?: FlightSearchFormData
}

export function FlightSearchForm({ onSearch, initialData }: FlightSearchFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        trigger
    } = useForm<FlightSearchFormData>({
        resolver: zodResolver(searchSchema),
        defaultValues: initialData || {
            tripType: TripType.ROUND_TRIP,
            origin: '',
            destination: '',
            departureDate: '',
            returnDate: '',
            seatClass: SeatClassType.ECONOMY,
            passengers: {
                adults: 1,
                children: 0,
                infants: 0
            }
        }
    })

    const tripType = watch('tripType')
    const departureDate = watch('departureDate')

    const onSubmitForm = handleSubmit((data) => {
        onSearch(data)
    })

    const handleTripTypeChange = (value: string) => {
        setValue('tripType', value as TripType)
        if (value === TripType.ONE_WAY) {
            setValue('returnDate', '')
        }
        trigger()
    }

    const handlePassengerChange = (type: 'adults' | 'children' | 'infants', value: number) => {
        setValue(`passengers.${type}`, value)
        trigger('passengers')
    }

    return (
        <Card className="mb-8">
            <form onSubmit={onSubmitForm} className="space-y-6">
                <div>
                    <RadioGroup
                        label="Trip Type"
                        options={[
                            { value: TripType.ROUND_TRIP, label: 'Round Trip' },
                            { value: TripType.ONE_WAY, label: 'One Way' },
                        ]}
                        value={tripType}
                        onChange={handleTripTypeChange}
                        error={errors.tripType?.message}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <AirportSelect
                            label="From"
                            value={watch('origin')}
                            onChange={(value) => setValue('origin', value, { shouldValidate: true })}
                            excludeAirport={watch('destination')}
                            error={errors.origin?.message}
                        />
                    </div>
                    <div>
                        <AirportSelect
                            label="To"
                            value={watch('destination')}
                            onChange={(value) => setValue('destination', value, { shouldValidate: true })}
                            excludeAirport={watch('origin')}
                            error={errors.destination?.message}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            type="date"
                            label="Departure Date"
                            error={errors.departureDate?.message}
                            {...register('departureDate')}
                        />
                    </div>
                    {tripType === TripType.ROUND_TRIP && (
                        <div>
                            <Input
                                type="date"
                                label="Return Date"
                                error={errors.returnDate?.message}
                                min={departureDate}
                                {...register('returnDate')}
                            />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <PassengerCounter
                        label="Adults"
                        value={watch('passengers.adults')}
                        onChange={(value) => handlePassengerChange('adults', value)}
                        min={1}
                        error={errors.passengers?.adults?.message}
                    />
                    <PassengerCounter
                        label="Children"
                        value={watch('passengers.children')}
                        onChange={(value) => handlePassengerChange('children', value)}
                        error={errors.passengers?.children?.message}
                    />
                    <PassengerCounter
                        label="Infants"
                        value={watch('passengers.infants')}
                        onChange={(value) => handlePassengerChange('infants', value)}
                        error={errors.passengers?.infants?.message}
                    />
                    {errors.passengers?.message && (
                        <div className="md:col-span-3">
                            <ErrorMessage message={errors.passengers.message} />
                        </div>
                    )}
                </div>

                <div>
                    <Select
                        label="Seat Class"
                        options={SEAT_CLASS_OPTIONS}
                        error={errors.seatClass?.message}
                        {...register('seatClass')}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                    Search Flights
                </button>
            </form>
        </Card>
    )
}
