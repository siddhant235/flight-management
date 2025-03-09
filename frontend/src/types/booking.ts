import { Gender } from '@/lib/validations/passengerSchema'
import { SeatClassType } from './flight'

export interface Passenger {
    id: string
    firstName: string
    lastName: string
    age: number
    gender: Gender
    email: string
    phone: string
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'
export type PaymentMethod = 'CREDIT_CARD' | 'PAYPAL' | 'UPI' | 'BANK_TRANSFER'

export interface Booking {
    id: string
    flight_id: string
    user_id: string
    booking_reference: string
    booking_status: BookingStatus
    payment_method: string
    total_amount: number
    created_at: string
}

export interface BookingPassenger {
    id: string
    booking_id: string
    passenger_id: string
    seat_class: SeatClassType
    seat_number: string
    created_at: string
}

interface FlightBooking {
    flightId: string;
    seatClass: SeatClassType;
    departureDate: string;
    departureTime: string;
    arrivalTime: string;
    arrivalDate: string;

}

export interface CreateBookingRequest {
    outboundFlight: FlightBooking;
    returnFlight?: FlightBooking;
    passengers: Omit<Passenger, 'id'>[]
    paymentMethodId: string
    totalAmount: number
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