import { SeatClassType } from './flight'
import { Gender } from './profile';

export interface Passenger {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: Gender;
    seatClass?: string;
    seatNumber?: string;
    age: number;
}
export interface BookingPassengerResponse {
    id: string;
    booking_id: string;
    passenger_id: string;
    seat_class: SeatClassType;
    seat_number: string;
    first_name: string;
    last_name: string;
}
export interface Flight {
    id: string;
    airline: string;
    flight_number: string;
    departure_airport: string;
    arrival_airport: string;
    economy_price: number;
    premium_economy_price: number;
    business_price: number;
    first_class_price: number;
}

export interface Booking {
    id: string;
    booking_reference: string;
    booking_status: string;
    total_amount: number;
    departure_date: string;
    departure_time: string;
    arrival_date: string;
    arrival_time: string;
    created_at: string;
    user_id: string;
    flights: Flight;
    passengers: BookingPassengerResponse[];
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'
export type PaymentMethod = 'CREDIT_CARD' | 'PAYPAL' | 'UPI' | 'BANK_TRANSFER'

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