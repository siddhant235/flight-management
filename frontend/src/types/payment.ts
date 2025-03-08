export interface PaymentMethod {
    id: string;
    type: 'CREDIT_CARD' | 'DEBIT_CARD';
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