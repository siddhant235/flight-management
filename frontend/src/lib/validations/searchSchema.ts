import { z } from 'zod'
import { TripType, SeatClassType } from '@/types/flight'

const today = new Date()
today.setHours(0, 0, 0, 0)

export const searchSchema = z.object({
    tripType: z.nativeEnum(TripType),
    origin: z.string().min(1, 'Origin airport is required'),
    destination: z.string().min(1, 'Destination airport is required'),
    departureDate: z.string().min(1, 'Departure date is required')
        .refine((date) => new Date(date) >= today, {
            message: 'Departure date cannot be in the past'
        }),
    returnDate: z.string().optional()
        .refine((date) => {
            if (!date) return true
            return new Date(date) >= today
        }, {
            message: 'Return date cannot be in the past'
        }),
    seatClass: z.nativeEnum(SeatClassType, {
        errorMap: () => ({ message: 'Please select a seat class' })
    }),
    passengers: z.object({
        adults: z.number()
            .min(1, 'At least one adult is required')
            .max(9, 'Maximum 9 passengers allowed'),
        children: z.number()
            .min(0, 'Children count cannot be negative')
            .max(9, 'Maximum 9 passengers allowed'),
        infants: z.number()
            .min(0, 'Infants count cannot be negative')
            .max(9, 'Maximum 9 passengers allowed')
    }).refine((data) => {
        const total = data.adults + data.children + data.infants
        return total <= 9
    }, {
        message: 'Total passengers cannot exceed 9'
    }).refine((data) => {
        return data.infants <= data.adults
    }, {
        message: 'Number of infants cannot exceed number of adults'
    })
}).refine((data) => {
    return data.origin !== data.destination
}, {
    message: 'Origin and destination cannot be the same',
    path: ['destination']
}).refine((data) => {
    if (data.tripType === TripType.ROUND_TRIP && data.returnDate) {
        return new Date(data.returnDate) >= new Date(data.departureDate)
    }
    return true
}, {
    message: 'Return date must be after departure date',
    path: ['returnDate']
})
