import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";
import { SeatClassType } from "@/types/flight";
import { SupabaseClient } from "@supabase/supabase-js";

interface FlightSeats {
    economy_seats: number;
    premium_economy_seats: number;
    business_seats: number;
    first_class_seats: number;
}

interface FlightBookingRequest {
    flightId: string;
    seatClass: SeatClassType;
}

interface PassengerData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
}

async function processFlightSeats(supabase: SupabaseClient, flight: FlightBookingRequest, passengerCount: number) {
    const seatClassColumnMap = {
        [SeatClassType.ECONOMY]: "economy_seats",
        [SeatClassType.PREMIUM_ECONOMY]: "premium_economy_seats",
        [SeatClassType.BUSINESS]: "business_seats",
        [SeatClassType.FIRST]: "first_class_seats",
    } as const;

    const selectedSeatColumn = seatClassColumnMap[flight.seatClass];
    if (!selectedSeatColumn) {
        throw new Error("Invalid seat class selection");
    }

    const { data: flightData, error: flightError } = await supabase
        .from("flights")
        .select(selectedSeatColumn)
        .eq("id", flight.flightId)
        .single();

    if (flightError || !flightData) {
        throw new Error(`Flight not found: ${flight.flightId}`);
    }

    const currentSeats = (flightData as FlightSeats)[selectedSeatColumn];
    const newSeats = currentSeats - passengerCount;

    if (newSeats < 0) {
        throw new Error(`Not enough ${flight.seatClass} seats available for flight ${flight.flightId}`);
    }

    const { error: updateError } = await supabase
        .from("flights")
        .update({ [selectedSeatColumn]: newSeats })
        .eq("id", flight.flightId);

    if (updateError) throw updateError;

    return true;
}

async function processPassengers(supabase: SupabaseClient, passengers: PassengerData[]) {
    const passengerIds: { [email: string]: string } = {};

    await Promise.all(
        passengers.map(async (passenger) => {
            const { firstName, lastName, email, phone, gender } = passenger;

            const { data: existingPassenger } = await supabase
                .from("passengers")
                .select("id")
                .eq("email", email)
                .single();

            let passenger_id = existingPassenger?.id;

            if (!passenger_id) {
                const { data: newPassenger, error: passengerInsertError } = await supabase
                    .from("passengers")
                    .insert([{ first_name: firstName, last_name: lastName, email, phone, gender }])
                    .select("id")
                    .single();

                if (passengerInsertError) throw passengerInsertError;
                passenger_id = newPassenger.id;
            }

            passengerIds[email] = passenger_id;
        })
    );

    return passengerIds;
}

async function createBookingPassengers(supabase: SupabaseClient, bookingId: string, flights: FlightBookingRequest[], passengers: PassengerData[], passengerIds: { [email: string]: string }) {
    const bookingPassengersData = flights.flatMap(flight =>
        passengers.map(passenger => ({
            booking_id: bookingId,
            passenger_id: passengerIds[passenger.email],
            seat_class: flight.seatClass.toUpperCase(),
            seat_number: `${flight.seatClass.charAt(0)}${Math.floor(Math.random() * 30) + 1}`,
        }))
    );
    console.log("Booking Passengers Data", bookingPassengersData, passengers);
    const { error: bookingPassengersError } = await supabase
        .from("booking_passengers")
        .insert(bookingPassengersData);

    if (bookingPassengersError) throw bookingPassengersError;
}

export async function POST(request: Request) {
    const supabase = await createClient();
    let payment_id: string | null = null;
    const bookings: { id: string; flight: FlightBookingRequest }[] = [];

    try {
        // Step 1: Authenticate user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Step 2: Parse request body
        const {
            outboundFlight,
            returnFlight,
            passengers,
            totalAmount,
            transactionId, // Payment gateway transaction ID
        } = await request.json();

        const flights: FlightBookingRequest[] = returnFlight
            ? [outboundFlight, returnFlight]
            : [outboundFlight];

        // Step 3: Process all flights concurrently
        await Promise.all(
            flights.map(flight => processFlightSeats(supabase, flight, passengers.length))
        );

        // Step 4: Insert Payment (Mark as PENDING)
        const { data: payment, error: paymentError } = await supabase
            .from("payments")
            .insert({
                user_id: user.id,
                payment_method: "CREDIT_CARD",
                payment_status: "PENDING",
                total_amount: totalAmount,
                transaction_id: transactionId,
            })
            .select("id")
            .single();
        if (paymentError || !payment) throw paymentError;
        payment_id = payment.id;

        // Step 5: Create bookings (separate for outbound and return)
        const bookingReference = crypto.randomBytes(4).toString("hex").toUpperCase();

        // Create outbound booking
        const { data: outboundBooking, error: outboundBookingError } = await supabase
            .from("booking")
            .insert({
                flight_id: outboundFlight.flightId,
                user_id: user.id,
                booking_reference: bookingReference,
                booking_status: "CONFIRMED",
                payment_id,
                total_amount: totalAmount * passengers.length / (returnFlight ? 2 : 1), // Split amount for round trips
            })
            .select("id")
            .single();

        if (outboundBookingError || !outboundBooking) throw outboundBookingError;
        bookings.push({ id: outboundBooking.id, flight: outboundFlight });

        // Create return booking if it exists
        if (returnFlight) {
            const { data: returnBooking, error: returnBookingError } = await supabase
                .from("booking")
                .insert({
                    flight_id: returnFlight.flightId,
                    user_id: user.id,
                    booking_reference: bookingReference, // Same reference for related bookings
                    booking_status: "CONFIRMED",
                    payment_id,
                    total_amount: totalAmount * passengers.length / 2, // Split amount for round trips
                })
                .select("id")
                .single();

            if (returnBookingError || !returnBooking) throw returnBookingError;
            bookings.push({ id: returnBooking.id, flight: returnFlight });
        }

        // Step 6: Process passengers concurrently
        const passengerIds = await processPassengers(supabase, passengers);
        console.log("BOOKINGS", bookings);
        // Step 7: Create booking passengers for each booking
        await Promise.all(
            bookings.map(booking =>
                createBookingPassengers(
                    supabase,
                    booking.id,
                    [booking.flight], // Pass single flight for each booking
                    passengers,
                    passengerIds
                )
            )
        );

        // Step 8: Update Payment to "COMPLETED"
        await supabase
            .from("payments")
            .update({ payment_status: "COMPLETED" })
            .eq("id", payment_id);

        // Step 9: Return success response
        return NextResponse.json({
            message: "Booking Successful",
            bookingReference,
            bookings,
            payment,
        });

    } catch (error) {
        console.error("Transaction Error:", error);

        // Rollback: Delete bookings & payment if failed
        if (bookings?.length > 0) {
            await Promise.all(
                bookings.map(booking =>
                    supabase.from("booking").delete().eq("id", booking.id)
                )
            );
        }
        if (payment_id) await supabase.from("payments").delete().eq("id", payment_id);

        return NextResponse.json({ error: "Transaction failed", details: error }, { status: 500 });
    }
}
