import * as z from 'zod'

export const Gender = {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
    OTHER: 'OTHER'
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export const passengerSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    age: z.number().min(0, 'Age must be a positive number'),
    email: z.string().email('Invalid email address'),
    phone: z.string()
        .min(10, 'Phone number must be at least 10 digits')
        .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
    gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER], {
        errorMap: () => ({ message: 'Please select a gender' })
    }),
}) 