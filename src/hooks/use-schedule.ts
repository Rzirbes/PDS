import useSWR from "swr";
import { createSchedule, CreateScheduleDto, getSchedules } from "../services/schedule-service";
import { apiFetch } from "../services/api";

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
    const key = ['schedules', start.toISOString(), end.toISOString()];
    const { data, error, isLoading, mutate } = useSWR(key, () => {
        console.log("Data de início no useSchedule:" + start + " " + "Data final: " + end)
        return getSchedules(start, end);
    });

    return {
        schedules: data?.schedules || [],
        isLoading,
        error,
        mutate,
    };
}

export function getSchedulesKey(start: Date, end: Date): [string, string, string] {
    return ['schedules', start.toISOString(), end.toISOString()];
}

