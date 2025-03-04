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
    availableSeats: number;
    price: number;
    seatClass: string;
}

interface SeatClassColumn {
    seats: string;
    price: string;
}

export const transformFlightData = (
    flights: DatabaseFlight[] | null,
    seatClass: SeatClassType,
    selectedSeatClass: SeatClassColumn
): TransformedFlight[] => {
    if (!flights) return [];
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
        availableSeats: flight[selectedSeatClass.seats] as number,
        price: flight[selectedSeatClass.price] as number,
        seatClass: seatClass
    }));
};
