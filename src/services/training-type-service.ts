import { TrainingType } from '../types/training-type';
import { apiFetch } from './api';

export type CreateTrainingTypePayload = {
  name: string
  description?: string
}

export async function getTrainingTypes(): Promise<{ data: TrainingType[] }> {
    return apiFetch('training-types');
}

export async function createTrainingType(payload: CreateTrainingTypePayload) {
  return apiFetch('training-types', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}
