import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";
import { SeatClassType } from "@/types/flight";
import { SupabaseClient } from "@supabase/supabase-js";
import { generateETicketHTML } from "@/lib/utils/emailTemplates";

interface FlightBookingRequest {
    flightId: string;
    seatClass: SeatClassType;
    departureDate: string;
    arrivalDate: string;
    departureTime: string;
    arrivalTime: string;
}

interface PassengerData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
}
const seatClassColumnMap = {
    [SeatClassType.ECONOMY]: "economy",
    [SeatClassType.PREMIUM_ECONOMY]: "premium_economy",
    [SeatClassType.BUSINESS]: "business",
    [SeatClassType.FIRST]: "first_class",
} as const;

async function processFlightSeats(supabase: SupabaseClient, flight: FlightBookingRequest, passengerCount: number) {
    const { data, error } = await supabase.rpc("book_flight_seat", {
        flight_id: flight.flightId,
        seat_class: seatClassColumnMap[flight.seatClass].toUpperCase(),
        passenger_count: passengerCount
    });
    console.log("FLIGHT DATA FROM BOOKING", data, flight, seatClassColumnMap[flight.seatClass])
    if (error || !data) {
        throw new Error(`Not enough ${flight.seatClass} seats available for flight ${flight.flightId}`);
    }

    return {
        flightId: flight.flightId,
        seatClass: flight.seatClass,
        passengerCount
    };
}


async function processPassengers(supabase: SupabaseClient, passengers: PassengerData[]) {
    const passengerIds: { [email: string]: string } = {};

    await Promise.all(
        passengers.map(async (passenger) => {
            const { firstName, lastName, email, phone, gender } = passenger;

            // Check for existing passenger by email or phone
            const { data: existingPassenger } = await supabase
                .from("passengers")
                .select("id")
                .or(`email.eq.${email},phone.eq.${phone}`)
                .single();

            let passenger_id = existingPassenger?.id;

            if (!passenger_id) {
                // If passenger doesn't exist, create new record
                const { data: newPassenger, error: passengerInsertError } = await supabase
                    .from("passengers")
                    .insert([{
                        first_name: firstName,
                        last_name: lastName,
                        email,
                        phone,
                        gender
                    }])
                    .select("id")
                    .single();

                if (passengerInsertError) {
                    // If insert fails due to race condition, try to fetch again
                    const { data: retryPassenger } = await supabase
                        .from("passengers")
                        .select("id")
                        .or(`email.eq.${email},phone.eq.${phone}`)
                        .single();

                    if (!retryPassenger) {
                        throw passengerInsertError;
                    }
                    passenger_id = retryPassenger.id;
                } else {
                    passenger_id = newPassenger.id;
                }
            }

            passengerIds[email] = passenger_id;
        })
    );

    return passengerIds;
}
// const rollBackSeats = async (supabase: SupabaseClient, flight: FlightBookingRequest, passengerCount: number) => {
//     const seatUpdates: { flightId: string; seatColumn: string; originalSeats: number; newSeats: number; passengerCount: number }[] = [];
//     const processedSeats = await getFlightSeats(supabase, flight, passengerCount);
//     seatUpdates.push(processedSeats);
//     return seatUpdates;
// }
async function createBookingPassengers(supabase: SupabaseClient, bookingId: string, flights: FlightBookingRequest[], passengers: PassengerData[], passengerIds: { [email: string]: string }) {
    const bookingPassengersData = flights.flatMap(flight =>
        passengers.map(passenger => ({
            booking_id: bookingId,
            passenger_id: passengerIds[passenger.email],
            seat_class: seatClassColumnMap[flight.seatClass].toUpperCase(),
            seat_number: `${flight.seatClass.charAt(0)}${Math.floor(Math.random() * 30) + 1}`,
        }))
    );
    console.log("BOOKING PASSENGERS DATA", bookingPassengersData)
    const { error: bookingPassengersError } = await supabase
        .from("booking_passengers")
        .insert(bookingPassengersData);

    if (bookingPassengersError) throw bookingPassengersError;
}

async function sendETickets(
    supabase: SupabaseClient,
    bookingReference: string,
    bookings: { id: string; flight: FlightBookingRequest }[],
    passengers: PassengerData[],
    totalAmount: number
) {
    try {
        // Get flight details for each booking
        const flightDetails = await Promise.all(
            bookings.map(async (booking) => {
                const { data: flight } = await supabase
                    .from("flights")
                    .select(`
                        id,
                        airline,
                        flight_number,
                        departure_airport,
                        arrival_airport
                    `)
                    .eq("id", booking.flight.flightId)
                    .single();

                const { data: bookingPassenger } = await supabase
                    .from("booking_passengers")
                    .select("seat_number, seat_class")
                    .eq("booking_id", booking.id)
                    .single();

                return {
                    flightId: booking.flight.flightId,
                    airlineName: flight?.airline || "Airline",
                    airlineId: flight?.flight_number || "XX",
                    departureDate: booking.flight.departureDate,
                    arrivalDate: booking.flight.arrivalDate,
                    departureTime: booking.flight.departureTime,
                    arrivalTime: booking.flight.arrivalTime,
                    origin: flight?.departure_airport || "",
                    destination: flight?.arrival_airport || "",
                    seatClass: bookingPassenger?.seat_class || "",
                    seatNumber: bookingPassenger?.seat_number || "",
                };
            })
        );

        // Send e-ticket to each passenger
        await Promise.all(
            passengers.map(async (passenger) => {
                const eTicketData = {
                    bookingReference,
                    passenger: {
                        firstName: passenger.firstName,
                        lastName: passenger.lastName,
                        email: passenger.email,
                    },
                    flights: flightDetails,
                    totalAmount: totalAmount / passengers.length, // Individual passenger's share
                };

                const eTicketHtml = generateETicketHTML(eTicketData);

                // Use SendGrid API directly
                const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        personalizations: [{
                            to: [{ email: passenger.email }],
                        }],
                        from: {
                            email: process.env.FROM_EMAIL || '',
                            name: process.env.FROM_NAME || 'Flight Booking System'
                        },
                        subject: `Your Flight E-Ticket (Ref: ${bookingReference})`,
                        content: [{
                            type: 'text/html',
                            value: eTicketHtml,
                        }],
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('SendGrid API error:', errorData);
                    throw new Error(`Failed to send e-ticket to ${passenger.email}`);
                }
            })
        );
    } catch (error) {
        console.error("Error sending e-tickets:", error);
        // Don't throw the error as this is a non-critical operation
        // The booking is already confirmed at this point
    }
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
            transactionId,
        } = await request.json();

        const flights: FlightBookingRequest[] = returnFlight
            ? [outboundFlight, returnFlight]
            : [outboundFlight];

        // Step 3: Process all flights concurrently and store seat updates
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
                departure_date: outboundFlight.departureDate,
                arrival_date: outboundFlight.arrivalDate,
                departure_time: outboundFlight.departureTime,
                arrival_time: outboundFlight.arrivalTime,
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
                    departure_date: returnFlight.departureDate,
                    arrival_date: returnFlight.arrivalDate,
                    departure_time: returnFlight.departureTime,
                    arrival_time: returnFlight.arrivalTime,
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
            .update({ payment_status: "COMPLETED", booking_id: bookings[0].id })
            .eq("id", payment_id);

        // Step 9: Generate and send e-tickets
        await sendETickets(
            supabase,
            bookingReference,
            bookings,
            passengers,
            totalAmount
        );

        // Step 10: Return success response
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

