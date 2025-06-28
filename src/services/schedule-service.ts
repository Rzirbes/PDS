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