import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { CreatePaymentMethodData } from '@/types/profile';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: paymentMethods, error } = await supabase
            .from('payment_methods')
            .select('*')
            .eq('user_id', user.id)
            .order('is_default', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(paymentMethods);
    } catch (error) {
        console.error('Payment methods fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const paymentData: CreatePaymentMethodData = await request.json();

        const { data: paymentMethod, error } = await supabase
            .from('payment_methods')
            .insert({
                user_id: user.id,
                ...paymentData,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(paymentMethod);
    } catch (error) {
        console.error('Payment method creation error:', error);
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

        const { id, ...updateData } = await request.json();

        const { data: paymentMethod, error } = await supabase
            .from('payment_methods')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(paymentMethod);
    } catch (error) {
        console.error('Payment method update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await request.json();

        const { error } = await supabase
            .from('payment_methods')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Payment method deletion error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 