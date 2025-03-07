export interface Passenger {
    id: string
    firstName: string
    lastName: string
    age: string
    email: string
    phone: string
    gender?: 'male' | 'female' | 'other'
}

export interface Booking {
    id: string
    flightId: string
    returnFlightId?: string
    passengers: Passenger[]
    paymentMethodId: string
    totalAmount: number
    status: 'pending' | 'confirmed' | 'cancelled'
    createdAt: string
    updatedAt: string
}

export interface CreateBookingRequest {
    flightId: string
    passengers: Omit<Passenger, 'id'>[]
    paymentMethodId: string
    totalAmount: number
}

export interface CreateBookingResponse {
    booking: Booking
    updatedFlight: {
        id: string
        availableSeats: {
            economy: number
            business: number
            first: number
        }
    }
} 