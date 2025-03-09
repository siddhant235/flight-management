import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
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

        // Get booking to verify ownership and current status
        const { data: booking, error: bookingError } = await supabase
            .from("booking")
            .select("id, user_id, booking_status")
            .eq("id", bookingId)
            .single();

        if (bookingError || !booking) {
            return NextResponse.json(
                { error: "Booking not found" },
                { status: 404 }
            );
        }

        if (booking.user_id !== user.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (booking.booking_status === 'CANCELLED') {
            return NextResponse.json(
                { error: "Booking is already cancelled" },
                { status: 400 }
            );
        }

        // Update booking status to cancelled
        const { error: updateError } = await supabase
            .from("booking")
            .update({ booking_status: 'CANCELLED' })
            .eq("id", bookingId);

        if (updateError) {
            console.error("Error cancelling booking:", updateError);
            return NextResponse.json(
                { error: "Failed to cancel booking" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "Booking cancelled successfully"
        });

    } catch (error) {
        console.error("Error in cancel booking route:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 