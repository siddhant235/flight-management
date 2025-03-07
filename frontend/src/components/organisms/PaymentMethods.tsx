'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { PaymentMethod } from '@/types/payment';
import { Input } from '../molecules/Input';
import { Button } from '../molecules/Button';

const paymentMethodSchema = z.object({
    card_number: z.string()
        .min(16, 'Card number must be at least 16 digits')
        .max(19, 'Card number must not exceed 19 digits')
        .regex(/^[0-9]+$/, 'Card number must contain only digits'),
    card_holder_name: z.string()
        .min(1, 'Card holder name is required')
        .regex(/^[a-zA-Z\s]+$/, 'Card holder name must contain only letters and spaces'),
    expiry_date: z.string()
        .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Expiry date must be in MM/YY format'),
    is_default: z.boolean().default(false),
});

type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

export type { PaymentMethodFormData };

interface PaymentMethodsProps {
    paymentMethods: PaymentMethod[];
    onAdd: (data: PaymentMethodFormData) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onSetDefault: (id: string) => Promise<void>;
}

export function PaymentMethods({
    paymentMethods,
    onAdd,
    onDelete,
    onSetDefault,
}: PaymentMethodsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PaymentMethodFormData>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            is_default: false,
        },
    });

    const handleFormSubmit = async (data: PaymentMethodFormData) => {
        try {
            setIsLoading(true);
            setError(null);
            await onAdd(data);
            reset();
            setShowAddForm(false);
        } catch (err) {
            console.error('Payment method creation error:', err);
            setError('Failed to add payment method');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Payment Methods</h2>
                <Button
                    type="button"
                    onClick={() => setShowAddForm(!showAddForm)}
                    variant="secondary"
                >
                    {showAddForm ? 'Cancel' : 'Add Payment Method'}
                </Button>
            </div>

            {showAddForm && (
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 border rounded-lg p-4">
                    <Input
                        label="Card Number"
                        {...register('card_number')}
                        error={errors.card_number?.message}
                        maxLength={19}
                        placeholder="1234 5678 9012 3456"
                        disabled={isLoading}
                    />

                    <Input
                        label="Card Holder Name"
                        {...register('card_holder_name')}
                        error={errors.card_holder_name?.message}
                        placeholder="JOHN DOE"
                        disabled={isLoading}
                    />

                    <Input
                        label="Expiry Date"
                        {...register('expiry_date')}
                        error={errors.expiry_date?.message}
                        maxLength={5}
                        placeholder="MM/YY"
                        disabled={isLoading}
                    />

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            {...register('is_default')}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                        <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Set as default payment method
                        </label>
                    </div>

                    {error && (
                        <div className="text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Adding...' : 'Add Payment Method'}
                    </Button>
                </form>
            )}

            <div className="space-y-4">
                {paymentMethods.map((method) => (
                    <div
                        key={method.id}
                        className="flex items-center justify-between border rounded-lg p-4"
                    >
                        <div>
                            <div className="font-medium">
                                {method.card_holder_name}
                            </div>
                            <div className="text-sm text-gray-500">
                                {method.card_number.slice(-4).padStart(method.card_number.length, '*')}
                            </div>
                            <div className="text-sm text-gray-500">
                                Expires {method.expiry_date}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            {!method.is_default && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => onSetDefault(method.id)}
                                >
                                    Set as Default
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="danger"
                                onClick={() => onDelete(method.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}

                {paymentMethods.length === 0 && !showAddForm && (
                    <p className="text-gray-500 text-center py-4">
                        No payment methods added yet
                    </p>
                )}
            </div>
        </div>
    );
} 