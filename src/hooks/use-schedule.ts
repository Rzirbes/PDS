import { createSchedule, CreateScheduleDto } from "../services/schedule-service";

export function useCreateSchedule() {
    async function submit(data: CreateScheduleDto): Promise<{ id: string } | null> {
        try {
            const result = await createSchedule(data);
            return result;
        } catch (err: any) {
            throw new Error(err?.message ?? 'Erro ao criar agendamento');
        }
    }

    return { submit };
}
