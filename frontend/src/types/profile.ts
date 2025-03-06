export type Gender = 'male' | 'female' | 'other';

export interface PaymentMethod {
    id: string;
    user_id: string;
    card_number: string;
    card_holder_name: string;
    expiry_date: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

export interface Profile {
    id: string;
    full_name: string;
    email: string;
    age?: number;
    phone?: string;
    address?: string;
    gender?: Gender;
    payment_methods?: PaymentMethod[];
    created_at: string;
    updated_at: string;
}

export type UpdateProfileData = Omit<Profile, 'id' | 'email' | 'created_at' | 'updated_at'>;
export type CreatePaymentMethodData = Omit<PaymentMethod, 'id' | 'user_id' | 'created_at' | 'updated_at'>; 