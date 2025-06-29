import useSWR from "swr";
import { createSchedule, CreateScheduleDto, getSchedules } from "../services/schedule-service";

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
export function useSchedules(start: Date, end: Date) {
    const { data, error, isLoading } = useSWR(
        ['schedules', start.toISOString(), end.toISOString()],
        () => getSchedules(start, end)
    );

    return {
        schedules: data?.schedules || [],
        isLoading,
        error,
    };
}