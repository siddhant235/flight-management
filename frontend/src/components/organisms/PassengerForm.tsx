'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/atoms/FormElements'
import { Button } from '@/components/molecules/Button'
import type { Passenger } from '@/types/booking'
import { passengerSchema } from '@/lib/validations/passengerSchema'

interface PassengerFormProps {
    onSubmit: (data: Omit<Passenger, 'id'>) => void
    isLoading?: boolean
    initialData?: Omit<Passenger, 'id'>
}

export function PassengerForm({ onSubmit, isLoading, initialData }: PassengerFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Omit<Passenger, 'id'>>({
        resolver: zodResolver(passengerSchema),
        defaultValues: initialData
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="First Name"
                    error={errors.firstName?.message}
                    {...register('firstName')}
                />
                <Input
                    label="Last Name"
                    error={errors.lastName?.message}
                    {...register('lastName')}
                />
            </div>
            <Input
                type="number"
                label="Age"
                error={errors.age?.message}
                {...register('age', { valueAsNumber: true })}
            />
            <Input
                type="email"
                label="Email"
                error={errors.email?.message}
                {...register('email')}
            />
            <Input
                type="tel"
                label="Phone"
                error={errors.phone?.message}
                {...register('phone')}
            />
            <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
            >
                {isLoading ? 'Saving...' : initialData ? 'Update' : 'Save'}
            </Button>
        </form>
    )
} 