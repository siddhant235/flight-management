import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// ✅ Ensure Next.js correctly receives params
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        if (!id) {
            return NextResponse.json(
                { error: 'Missing flight ID' },
                { status: 400 }
            );
        }

        const { data: flight, error } = await supabase
            .from('flights')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !flight) {
            return NextResponse.json(
                { error: error?.message || 'Flight not found' },
                { status: error ? 500 : 404 }
            );
        }

        return NextResponse.json(flight);
    } catch (error) {
        console.error("Error fetching flight:", error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
