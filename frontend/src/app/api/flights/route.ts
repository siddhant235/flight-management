import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log('Fetching flights from Supabase...');
        const { data, error } = await supabase
            .from('flights')
            .select('*')
            .order('departure_time', { ascending: true });

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch flights' },
                { status: 500 }
            );
        }

        if (!data || data.length === 0) {
            console.log('No flights found');
            return NextResponse.json(
                { error: 'No flights found' },
                { status: 404 }
            );
        }

        console.log(`Successfully fetched ${data.length} flights`);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
