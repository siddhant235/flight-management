import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { TripType, SeatClassType } from '@/types/flight';
import type { FlightSearchFormData } from '@/types/flight';
import { transformFlightData, DatabaseFlight } from '@/lib/mappers/flightMapper';

export async function POST(request: Request) {
    try {
        const searchParams: FlightSearchFormData = await request.json();

        // Extract the weekday from the provided departure date
        const departureDay = new Date(searchParams.departureDate).toLocaleString('en-US', { weekday: 'long' });
        const returnDay = searchParams.returnDate
            ? new Date(searchParams.returnDate).toLocaleString('en-US', { weekday: 'long' })
            : null;

        // Map seat class to the corresponding columns in the database
        const seatClassColumnMap = {
            'Economy': { seats: 'economy_seats', price: 'economy_price' },
            'Premium Economy': { seats: 'premium_economy_seats', price: 'premium_economy_price' },
            'Business': { seats: 'business_seats', price: 'business_price' },
            'First': { seats: 'first_class_seats', price: 'first_class_price' }
        };

        const selectedSeatClass = seatClassColumnMap[searchParams.seatClass as SeatClassType];

        if (!selectedSeatClass) {
            return NextResponse.json(
                { error: 'Invalid seat class selection' },
                { status: 400 }
            );
        }
        // Query for outbound flights
        const query = supabase
            .from('flights')
            .select(`
                id,
                airline,
                flight_number,
                departure_airport,
                arrival_airport,
                departure_time,
                arrival_time,
                operating_days,
                status,
                remarks,
                ${selectedSeatClass.seats},
                ${selectedSeatClass.price}
            `)
            .eq('departure_airport', searchParams.origin)
            .eq('arrival_airport', searchParams.destination)
            .contains('operating_days', [departureDay])
            .gt(selectedSeatClass.seats, 0)
            .eq('status', 'RUNNING')
            .order('departure_time', { ascending: true });

        // Handle ROUND TRIP flights
        let returnQuery = null;
        if (searchParams.tripType === TripType.ROUND_TRIP && searchParams.returnDate) {
            returnQuery = supabase
                .from('flights')
                .select(`
                    id,
                    airline,
                    flight_number,
                    departure_airport,
                    arrival_airport,
                    departure_time,
                    arrival_time,
                    operating_days,
                    status,
                    remarks,
                    ${selectedSeatClass.seats},
                    ${selectedSeatClass.price}
                `)
                .eq('departure_airport', searchParams.destination)
                .eq('arrival_airport', searchParams.origin)
                .contains('operating_days', [returnDay])
                .gt(selectedSeatClass.seats, 0)
                .eq('status', 'RUNNING')
                .order('departure_time', { ascending: true });
        }
        // Execute queries simultaneously
        const [{ data: outboundFlights, error: outboundError }, { data: returnFlights }] = await Promise.all([
            query,
            returnQuery ? returnQuery : Promise.resolve({ data: null, error: null })
        ]);

        if (outboundError) {
            console.error('Supabase error (outbound):', outboundError);
            return NextResponse.json(
                { error: 'Failed to search outbound flights' },
                { status: 500 }
            );
        }

        if (!outboundFlights || outboundFlights.length === 0) {
            return NextResponse.json(
                { error: 'No flights found for the selected route, date, and seat class' },
                { status: 404 }
            );
        }
        const response = {
            outboundFlights: transformFlightData(outboundFlights as unknown as DatabaseFlight[], searchParams.seatClass),
            returnFlights: returnFlights ? transformFlightData(returnFlights as unknown as DatabaseFlight[], searchParams.seatClass) : []
        };
        console.log(response, "RESPONSE")
        return NextResponse.json(response);
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
