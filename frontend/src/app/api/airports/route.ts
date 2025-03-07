import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export interface Airport {
    airport_code: string;
    airport_name: string;
    city: string;
    country: string;
}

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('airports')
            .select('*')
            .order('city', { ascending: true });

        if (error) {
            return NextResponse.json(
                { error: 'Failed to fetch airports' },
                { status: 500 }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
