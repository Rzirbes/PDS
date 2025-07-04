import { formatISO } from "date-fns";
import { apiFetch } from "./api";

export interface Training {
    id: string
    scheduleId: string
    start: string
    end: string
    athleteId: string
    coachId: string
    completed: boolean
    canceled: boolean
    confirmed: boolean
    trainingPlanning: {
        id: string
        duration: number
        pse: number
        trainingType: {
            id: string
            name: string
        }
    }

}

export async function finishTraining(trainingData: any) {
    return apiFetch('/trainings', {
        method: 'POST',
        body: JSON.stringify(trainingData),
    });
}

function formatDateWithEndTime(date: Date): string {
    const end = new Date(date)
    end.setHours(23, 59, 59, 0)

    const iso = end.toISOString()
    return iso.split('.')[0]
}

export async function getCompletedTrainingsByAthlete(
    athleteUuid: string,
    start: Date,
    end: Date
): Promise<Training[]> {
    const query = new URLSearchParams({
        athleteUuid,
        startDate: start.toISOString(),
        endDate: formatDateWithEndTime(end),
    })

    return await apiFetch(`/trainings?${query.toString()}`)
}
