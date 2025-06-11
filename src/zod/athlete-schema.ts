import { z } from 'zod'

export const athleteSchema = z.object({
    id: z.number(),
    uuid: z.string(),
    name: z.string(),
    email: z.string().email(),
    birthday: z.date(),
    weight: z.number(),
    height: z.number(),
    isEnabled: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const athletesArraySchema = z.array(athleteSchema)
