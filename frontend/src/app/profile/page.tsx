'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ProfileForm } from '@/components/organisms/ProfileForm';
import { PaymentMethods } from '@/components/organisms/PaymentMethods';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/lib/services/profileApi';
import { defaultProfile } from '@/lib/constants';
import type { Profile, PaymentMethod } from '@/types/profile';
import type { RootState } from '@/lib/store';
import type { PaymentMethodFormData } from '@/components/organisms/PaymentMethods';

export default function ProfilePage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useSelector((state: RootState) => state.auth);
    const { data: profile = defaultProfile, isLoading: profileLoading, error: profileError } = useGetProfileQuery(undefined, {
        skip: !user,
    });
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

    useEffect(() => {
        if (!user && !authLoading) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const handleProfileUpdate = async (data: Partial<Profile>) => {
        try {
            await updateProfile(data as Profile).unwrap();
        } catch (error) {
            console.error('Profile update error:', error);
            throw error;
        }
    };

    const handleAddPaymentMethod = async (data: PaymentMethodFormData) => {
        try {
            const response = await fetch('/api/payment-methods', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to add payment method');
            }

            const newPaymentMethod = await response.json();
            await updateProfile({
                ...profile,
                payment_methods: [...(profile.payment_methods || []), newPaymentMethod],
            }).unwrap();
        } catch (error) {
            console.error('Failed to add payment method:', error);
            throw error;
        }
    };

    const handleDeletePaymentMethod = async (id: string) => {
        try {
            const response = await fetch('/api/payment-methods', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete payment method');
            }

            await updateProfile({
                ...profile,
                payment_methods: (profile.payment_methods || []).filter((method: PaymentMethod) => method.id !== id),
            }).unwrap();
        } catch (error) {
            console.error('Failed to delete payment method:', error);
            throw error;
        }
    };

    const handleSetDefaultPaymentMethod = async (id: string) => {
        try {
            const response = await fetch('/api/payment-methods', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, is_default: true }),
            });

            if (!response.ok) {
                throw new Error('Failed to set default payment method');
            }

            await updateProfile({
                ...profile,
                payment_methods: (profile.payment_methods || []).map((method: PaymentMethod) => ({
                    ...method,
                    is_default: method.id === id,
                })),
            }).unwrap();
        } catch (error) {
            console.error('Failed to set default payment method:', error);
            throw error;
        }
    };

    if (authLoading || profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                        Profile Settings
                    </h1>

                    {profileError && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-md">
                            Failed to load profile
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="p-6">
                            <ProfileForm
                                profile={profile}
                                onSubmit={handleProfileUpdate}
                                isLoading={isUpdating}
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg mt-6">
                        <div className="p-6">
                            <PaymentMethods
                                paymentMethods={profile.payment_methods || []}
                                onAdd={handleAddPaymentMethod}
                                onDelete={handleDeletePaymentMethod}
                                onSetDefault={handleSetDefaultPaymentMethod}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}