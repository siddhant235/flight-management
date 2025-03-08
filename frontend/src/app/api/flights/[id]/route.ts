import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { DatabaseFlight, transformFlightData } from '@/lib/mappers/flightMapper';
import { SeatClassType } from '@/types/flight';

// ✅ Ensure Next.js correctly receives params
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const seatClass = searchParams.get('seatClass') as SeatClassType || SeatClassType.ECONOMY;

    try {
        if (!id) {
            return NextResponse.json(
                { error: 'Missing flight ID' },
                { status: 400 }
            );
        }

        // Map seat class to the corresponding columns in the database
        const seatClassColumnMap = {
            'Economy': { seats: 'economy_seats', price: 'economy_price' },
            'Premium Economy': { seats: 'premium_economy_seats', price: 'premium_economy_price' },
            'Business': { seats: 'business_seats', price: 'business_price' },
            'First': { seats: 'first_class_seats', price: 'first_class_price' }
        };

        const selectedSeatClass = seatClassColumnMap[seatClass];

        if (!selectedSeatClass) {
            return NextResponse.json(
                { error: 'Invalid seat class selection' },
                { status: 400 }
            );
        }

        const { data: flight, error } = await supabase
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
            .eq('id', id)
            .single();

        if (error || !flight) {
            return NextResponse.json(
                { error: error?.message || 'Flight not found' },
                { status: error ? 500 : 404 }
            );
        }

        const transformedFlights = transformFlightData([flight as unknown as DatabaseFlight], seatClass);
        return NextResponse.json(transformedFlights[0]);
    } catch (error) {
        console.error("Error fetching flight:", error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
