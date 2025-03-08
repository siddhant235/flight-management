import { Gender } from '@/lib/validations/passengerSchema'
import { SeatClassType } from './flight'

export interface Passenger {
    id: string
    firstName: string
    lastName: string
    age: number
    email: string
    phone: string
    gender: Gender
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'
export type PaymentMethod = 'CREDIT_CARD' | 'PAYPAL' | 'UPI' | 'BANK_TRANSFER'

export interface Booking {
    id: string
    flightId: string
    userId: string
    bookingReference: string
    bookingStatus: BookingStatus
    paymentMethod: PaymentMethod
    totalAmount: number
    createdAt: string
}

export interface BookingPassenger {
    id: string
    bookingId: string
    passengerId: string
    seatClass: SeatClassType
    seatNumber: string
    createdAt: string
}

export interface CreateBookingRequest {
    flightId: string
    passengers: Omit<Passenger, 'id'>[]
    paymentMethodId: string
    totalAmount: number
    seatClass: SeatClassType
}

export interface CreateBookingResponse {
    booking: Booking
    passengers: BookingPassenger[]
    updatedFlight: {
        id: string
        availableSeats: {
            economy: number
            business: number
            first: number
        }
    }
} 