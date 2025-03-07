import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { UpdateProfileData } from '@/types/profile';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        if (error) {
            // If profile doesn't exist, create one with basic info
            if (error.code === 'PGRST116') {
                const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert({
                        id: user.id,
                        email: user.email,
                    })
                    .select()
                    .single();

                if (createError) {
                    return NextResponse.json({ error: createError.message }, { status: 500 });
                }

                return NextResponse.json(newProfile);
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const profileData: UpdateProfileData = await request.json();

        const { data: profile, error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                email: user.email,
                ...profileData,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 