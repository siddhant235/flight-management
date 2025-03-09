import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ bookingId: string }> }
) {
    try {
        const { bookingId } = await params;
        const supabase = await createClient();

        // Check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get booking details with all related data in a single query
        const { data: bookingPassengers, error: bookingError } = await supabase
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
                booking!inner (
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
            .eq("booking.user_id", user.id)
            .eq("booking_id", bookingId);

        if (bookingError) {
            console.error("Error fetching booking:", bookingError);
            return NextResponse.json(
                { error: "Failed to fetch booking details" },
                { status: 500 }
            );
        }

        if (!bookingPassengers || bookingPassengers.length === 0) {
            return NextResponse.json(
                { error: "Booking not found" },
                { status: 404 }
            );
        }

        // Transform the data to match the expected format
        const booking = bookingPassengers[0].booking;
        const passengers = bookingPassengers.map(bp => ({
            ...bp.passengers,
            seat_class: bp.seat_class,
            seat_number: bp.seat_number || undefined
        }));

        return NextResponse.json({
            booking: {
                ...booking,
                passengers
            }
        });

    } catch (error) {
        console.error("Error in booking details route:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 