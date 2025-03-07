'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/molecules/Button'
import { Input } from '@/components/molecules/Input'
import { Label } from '@/components/molecules/Label'

const passengerSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Age must be a positive number',
    }),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
})

type PassengerFormData = z.infer<typeof passengerSchema>

interface PassengerFormProps {
    onSubmit: (data: PassengerFormData) => void
    isLoading?: boolean
}

export function PassengerForm({ onSubmit, isLoading }: PassengerFormProps) {
    const form = useForm<PassengerFormData>({
        resolver: zodResolver(passengerSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            age: '',
            email: '',
            phone: '',
        }
    })

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                    id="firstName"
                    {...form.register('firstName')}
                    error={form.formState.errors.firstName?.message}
                />
            </div>

            <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                    id="lastName"
                    {...form.register('lastName')}
                    error={form.formState.errors.lastName?.message}
                />
            </div>

            <div>
                <Label htmlFor="age">Age</Label>
                <Input
                    id="age"
                    type="number"
                    {...form.register('age')}
                    error={form.formState.errors.age?.message}
                />
            </div>

            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    error={form.formState.errors.email?.message}
                />
            </div>

            <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                    id="phone"
                    {...form.register('phone')}
                    error={form.formState.errors.phone?.message}
                />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Processing...' : 'Continue to Payment'}
            </Button>
        </form>
    )
} 