import { supabase } from '@/lib/supabase'
import type { Profile, Gender } from '@/types/profile'
import type { PaymentMethodFormData } from '@/types/payment'

interface SupabasePaymentMethod {
    id: string;
    type: 'credit_card' | 'debit_card';
    card_number: string;
    card_holder_name: string;
    expiry_date: string;
    is_default: boolean;
}

interface SupabaseProfile {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    address: string;
    age?: number;
    gender?: Gender;
    payment_methods: SupabasePaymentMethod[];
    created_at: string;
    updated_at: string;
}

export const profileService = {
    async getProfile(): Promise<Profile | null> {
        const { data, error } = await supabase
            .from('profile')
            .select('*')
            .single()

        if (error) throw error
        if (!data) return null

        return data as Profile
    },

    async updateProfile(profile: Partial<Profile>): Promise<Profile> {
        const { data, error } = await supabase
            .from('profile')
            .update(profile)
            .eq('id', profile.id)
            .select()
            .single()

        if (error) throw error

        return data as Profile
    },

    async addPaymentMethod(paymentMethod: PaymentMethodFormData): Promise<Profile> {
        const { data: profile } = await supabase
            .from('profile')
            .select('payment_methods')
            .single()

        if (!profile) throw new Error('Profile not found')

        const supabaseProfile = profile as SupabaseProfile
        const paymentMethods = supabaseProfile.payment_methods || []
        const newPaymentMethod = {
            id: crypto.randomUUID(),
            type: 'credit_card',
            card_number: paymentMethod.card_number,
            card_holder_name: paymentMethod.card_holder_name,
            expiry_date: paymentMethod.expiry_date,
            is_default: paymentMethod.is_default
        }

        const updatedPaymentMethods = [...paymentMethods, newPaymentMethod]

        const { data, error } = await supabase
            .from('profile')
            .update({ payment_methods: updatedPaymentMethods })
            .eq('id', supabaseProfile.id)
            .select()
            .single()

        if (error) throw error

        return data as Profile
    },

    async updatePaymentMethod(paymentMethodId: string, updates: Partial<PaymentMethodFormData>): Promise<Profile> {
        const { data: profile } = await supabase
            .from('profile')
            .select('payment_methods')
            .single()

        if (!profile) throw new Error('Profile not found')

        const supabaseProfile = profile as SupabaseProfile
        const paymentMethods = supabaseProfile.payment_methods || []
        const updatedPaymentMethods = paymentMethods.map((method: SupabasePaymentMethod) =>
            method.id === paymentMethodId
                ? {
                    ...method,
                    ...(updates.card_number && { card_number: updates.card_number }),
                    ...(updates.card_holder_name && { card_holder_name: updates.card_holder_name }),
                    ...(updates.expiry_date && { expiry_date: updates.expiry_date }),
                    ...(typeof updates.is_default !== 'undefined' && { is_default: updates.is_default })
                }
                : method
        )

        const { data, error } = await supabase
            .from('profile')
            .update({ payment_methods: updatedPaymentMethods })
            .eq('id', supabaseProfile.id)
            .select()
            .single()

        if (error) throw error

        return data as Profile
    },

    async deletePaymentMethod(paymentMethodId: string): Promise<Profile> {
        const { data: profile } = await supabase
            .from('profile')
            .select('payment_methods')
            .single()

        if (!profile) throw new Error('Profile not found')

        const supabaseProfile = profile as SupabaseProfile
        const paymentMethods = supabaseProfile.payment_methods || []
        const updatedPaymentMethods = paymentMethods.filter(
            (method: SupabasePaymentMethod) => method.id !== paymentMethodId
        )

        const { data, error } = await supabase
            .from('profile')
            .update({ payment_methods: updatedPaymentMethods })
            .eq('id', supabaseProfile.id)
            .select()
            .single()

        if (error) throw error

        return data as Profile
    },

    async setDefaultPaymentMethod(paymentMethodId: string): Promise<Profile> {
        const { data: profile } = await supabase
            .from('profile')
            .select('payment_methods')
            .single()

        if (!profile) throw new Error('Profile not found')

        const supabaseProfile = profile as SupabaseProfile
        const paymentMethods = supabaseProfile.payment_methods || []
        const updatedPaymentMethods = paymentMethods.map((method: SupabasePaymentMethod) => ({
            ...method,
            is_default: method.id === paymentMethodId
        }))

        const { data, error } = await supabase
            .from('profile')
            .update({ payment_methods: updatedPaymentMethods })
            .eq('id', supabaseProfile.id)
            .select()
            .single()

        if (error) throw error

        return data as Profile
    }
} 