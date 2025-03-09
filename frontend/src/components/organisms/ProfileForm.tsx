'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Profile } from '@/types/profile';
import { Input } from '../molecules/Input';
import { Button } from '../molecules/Button';

const profileSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    age: z.number().min(18, 'You must be at least 18 years old').optional(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
    address: z.string().min(5, 'Address must be at least 5 characters').optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER'] as const).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
    profile: Profile;
    onSubmit: (data: ProfileFormData) => Promise<void>;
    isLoading?: boolean;
}

export const ProfileForm = ({ profile, onSubmit, isLoading = false }: ProfileFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: profile.full_name,
            age: profile.age,
            phone: profile.phone,
            address: profile.address,
            gender: profile.gender,
        },
    });
    const handleFormSubmit = async (data: ProfileFormData) => {
        try {
            await onSubmit(data);
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Personal Information
                </h3>
                <div className="space-y-6">
                    <Input
                        label="Full Name"
                        {...register('full_name')}
                        error={errors.full_name?.message}
                        disabled={isLoading}
                    />
                    <Input
                        label="Age"
                        type="number"
                        {...register('age', { valueAsNumber: true })}
                        error={errors.age?.message}
                        disabled={isLoading}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Gender
                        </label>
                        <select
                            {...register('gender')}
                            className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            disabled={isLoading}
                        >
                            <option value="">Select gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                        {errors.gender && (
                            <p className="mt-1.5 text-sm text-red-600">
                                {errors.gender.message}
                            </p>
                        )}
                    </div>
                    <Input
                        label="Phone"
                        placeholder="+1234567890"
                        {...register('phone')}
                        error={errors.phone?.message}
                        disabled={isLoading}
                    />
                    <Input
                        label="Address"
                        {...register('address')}
                        error={errors.address?.message}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
}; 