import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Passenger {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    gender: string;
    seat_class: string;
    seat_number?: string;
}

interface Flight {
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

interface Booking {
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
    passengers: Passenger[];
}

interface BookingPassenger {
    passengers: Passenger;
    seat_class: string;
    seat_number: string | null;
    booking: Booking;
}

export async function GET() {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data, error: bookingsError } = await supabase
            .from("booking_passengers")
            .select(`
                passengers (
                    id,
                    first_name,
                    last_name,
                    email,
                    phone,
                    gender
                ),
                seat_class,
                seat_number,
                booking (
                    id,
                    booking_reference,
                    booking_status,
                    total_amount,
                    departure_date,
                    departure_time,
                    arrival_date,
                    arrival_time,
                    created_at,
                    user_id,
                    flights (
                        id,
                        airline,
                        flight_number,
                        departure_airport,
                        arrival_airport,
                        economy_price,
                        premium_economy_price,
                        business_price,
                        first_class_price
                    )
                )
            `)
            .eq("booking.user_id", user.id);

        if (bookingsError) {
            throw bookingsError;
        }

        const bookingsMap = new Map<string, Booking>();
        const bookingPassengers = data as unknown as BookingPassenger[];

        bookingPassengers?.forEach((bp) => {
            if (!bp.booking) return;

            const booking = bookingsMap.get(bp.booking.id) || {
                ...bp.booking,
                passengers: []
            };

            booking.passengers.push({
                ...bp.passengers,
                seat_class: bp.seat_class,
                seat_number: bp.seat_number || undefined
            });

            bookingsMap.set(bp.booking.id, booking);
        });

        return NextResponse.json({
            bookings: Array.from(bookingsMap.values())
        });

    } catch (error) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json(
            { error: "Failed to fetch bookings" },
            { status: 500 }
        );
    }
} 