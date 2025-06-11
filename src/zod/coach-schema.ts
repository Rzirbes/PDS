// zod/coach-schema.ts
import { z } from 'zod'

export const coachSchema = z.object({
    id: z.number(),
    uuid: z.string(),
    name: z.string(),
    email: z.string().email(),
    isEnabled: z.boolean(),
    role: z.string().optional(),
    phone: z.string().optional(),
    schedulerColor: z.string().optional(),
    addressId: z.number().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    address: z
        .object({
            street: z.string(),
            number: z.string(),
            city: z.string(),
            state: z.string(),
            zipcode: z.string(),
        })
        .optional(),
})

export const coachesArraySchema = z.array(coachSchema)
