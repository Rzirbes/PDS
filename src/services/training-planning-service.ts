import { apiFetch } from './api';

export async function finishTrainingPlanning(trainingUuid: string): Promise<void> {
    await apiFetch(`/training-planning/${trainingUuid}/finish`, {
        method: 'PATCH',
    });
}