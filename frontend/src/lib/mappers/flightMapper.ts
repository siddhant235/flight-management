import { SeatClassType } from '@/types/flight';

export interface DatabaseFlight {
    id: string;
    airline: string;
    flight_number: string;
    departure_airport: string;
    arrival_airport: string;
    departure_time: string;
    arrival_time: string;
    operating_days: string[];
    status: string;
    remarks: string | null;
    economy_seats: number;
    premium_economy_seats: number;
    business_seats: number;
    first_class_seats: number;
    economy_price: number;
    premium_economy_price: number;
    business_price: number;
    first_class_price: number;
    [key: string]: string | string[] | number | null; // for dynamic seat class columns
}

export interface TransformedFlight {
    id: string;
    airline: string;
    flightNumber: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    operatingDays: string[];
    status: string;
    remarks: string | null;
    price: number;
    availableSeats: number;
}

const seatClassMap = {
    [SeatClassType.ECONOMY]: { seats: 'economy_seats', price: 'economy_price' },
    [SeatClassType.PREMIUM_ECONOMY]: { seats: 'premium_economy_seats', price: 'premium_economy_price' },
    [SeatClassType.BUSINESS]: { seats: 'business_seats', price: 'business_price' },
    [SeatClassType.FIRST]: { seats: 'first_class_seats', price: 'first_class_price' },
};

export const transformFlightData = (flights: DatabaseFlight[] | null, seatClass: SeatClassType = SeatClassType.ECONOMY): TransformedFlight[] => {
    if (!flights) return [];

    const { seats: seatField, price: priceField } = seatClassMap[seatClass];

    return flights.map(flight => ({
        id: flight.id,
        airline: flight.airline,
        flightNumber: flight.flight_number,
        departureAirport: flight.departure_airport,
        arrivalAirport: flight.arrival_airport,
        departureTime: flight.departure_time,
        arrivalTime: flight.arrival_time,
        operatingDays: flight.operating_days,
        status: flight.status,
        remarks: flight.remarks,
        price: flight[priceField] as number,
        availableSeats: flight[seatField] as number
    }));
};
