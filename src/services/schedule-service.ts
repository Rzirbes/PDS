import { format } from "date-fns"
import { apiFetch } from "./api"

export interface CreateTrainingPlanningDto {
    trainingTypeId: string
    duration: number
    pse: number
    description?: string
}

export interface CreateScheduleDto {
    start: Date
    end: Date
    coachId: string
    athleteId: string
    trainingPlanning: CreateTrainingPlanningDto
}


export async function createSchedule(data: CreateScheduleDto) {
    const payload = {
        ...data,
        start: data.start.toISOString(),
        end: data.end.toISOString(),
    }

    return await apiFetch('/schedule', {
        method: 'POST',
        body: JSON.stringify(payload),
    })
}

export async function getSchedules(start: Date, end: Date) {
    const query = new URLSearchParams({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
    });

    return await apiFetch(`/schedule?${query.toString()}`, {
        method: "GET",
    });
}

interface UpdateSchedulePayload {
    id: string;
    completed: boolean;
}

export async function updateSchedule({ id, completed }: UpdateSchedulePayload) {
    const payload = JSON.stringify({ completed });

    const response = await apiFetch(`/schedule/${id}`, {
        method: 'PUT',
        body: payload,
    });

    return response;
}