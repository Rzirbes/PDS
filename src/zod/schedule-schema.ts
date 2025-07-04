// schemas/schedule-schema.ts
import { z } from 'zod';

export const scheduleSchema = z.object({
    date: z.date(),
    timeStart: z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, 'Hora inválida (HH:MM)'),
    timeEnd: z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, 'Hora inválida (HH:MM)'),
    athleteId: z.string().min(1, 'Atleta é obrigatório'),
    coachId: z.string().min(1, 'Treinador é obrigatório'),
    trainingTypeId: z.string().min(1, 'Tipo de Treino é obrigatório'),
    description: z.string().optional(),
    duration: z.coerce.number().min(1, 'Duração é obrigatória'),
    pse: z.coerce.number().min(0, 'PSE é obrigatória'),
    hasRecurrence: z.boolean(),
});

export type ScheduleFormData = z.infer<typeof scheduleSchema>;
