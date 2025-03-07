export interface PaymentMethod {
    id: string;
    type: 'credit_card' | 'debit_card';
    card_number: string;
    card_holder_name: string;
    expiry_date: string;
    is_default: boolean;
}

export interface PaymentMethodFormData {
    card_number: string;
    card_holder_name: string;
    expiry_date: string;
    is_default: boolean;
} 