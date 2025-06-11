import { z } from 'zod'

export const monitorySchema = z.object({
    id: z.number(),
    uuid: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    athleteId: z.number(),
    week: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    weekLoad: z.number(),
    averageWeekLoad: z.number(),
    monotony: z.number(),
    chronic: z.number(),
    acute: z.number(),
    chronicAcute: z.number(),
    strain: z.number(),
    deviation: z.number(),
})

export const monitoryArraySchema = z.array(monitorySchema)