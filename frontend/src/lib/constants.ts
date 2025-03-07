import type { Profile } from '@/types/profile';

export const defaultProfile: Profile = {
    id: '',
    full_name: '',
    email: '',
    age: undefined,
    phone: '',
    address: '',
    gender: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    payment_methods: [],
}; 