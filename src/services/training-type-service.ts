import { apiFetch } from './api';

export interface TrainingType {
    id: number;
    name: string;
}

export async function getTrainingTypes(): Promise<{ data: TrainingType[] }> {
    return apiFetch('training-types');
}