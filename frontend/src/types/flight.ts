export enum CabinClass {
    ECONOMY = 'ECONOMY',
    PREMIUM_ECONOMY = 'PREMIUM_ECONOMY',
    BUSINESS = 'BUSINESS',
    FIRST = 'FIRST',
}

export enum TripType {
    ONE_WAY = 'one_way',
    ROUND_TRIP = 'round_trip'
}

export interface Airport {
    code: string
    city: string
    name: string
}

export interface FlightSearchFormData {
    tripType: TripType
    origin: string
    destination: string
    departureDate: string
    returnDate: string
    seatClass: SeatClassType
    passengers: {
        adults: number
        children: number
        infants: number
    }
}

export const CABIN_CLASS_LABELS: Record<CabinClass, string> = {
    [CabinClass.ECONOMY]: 'Economy',
    [CabinClass.PREMIUM_ECONOMY]: 'Premium Economy',
    [CabinClass.BUSINESS]: 'Business',
    [CabinClass.FIRST]: 'First',
}

export enum SeatClassType {
    ECONOMY = 'Economy',
    PREMIUM_ECONOMY = 'Premium Economy',
    BUSINESS = 'Business',
    FIRST = 'First'
}

export interface Flight {
    id: string;
    flightNumber: string;
    origin: Airport;
    destination: Airport;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    airline: string;
    availableSeats: number;
    cabinClass: CabinClass;
    seatClass: SeatClassType;
}

export interface FlightSearchParams {
    tripType: TripType;
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    seatClass: SeatClassType;
    passengers: {
        adults: number;
        children: number;
        infants: number;
    };
}

export interface Booking {
    id: string;
    flightId: string;
    userId: string;
    passengers: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string;
}
