import type { PaymentMethod } from './payment'

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface Profile {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    address: string;
    age?: number;
    gender?: Gender;
    payment_methods: PaymentMethod[];
    created_at: string;
    updated_at: string;
}

export type UpdateProfileData = Omit<Profile, 'id' | 'email' | 'created_at' | 'updated_at'>;
export type CreatePaymentMethodData = Omit<PaymentMethod, 'id' | 'user_id' | 'created_at' | 'updated_at'>; 