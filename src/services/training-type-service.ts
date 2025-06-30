import { TrainingType } from '../types/training-type';
import { apiFetch } from './api';



export async function getTrainingTypes(): Promise<{ data: TrainingType[] }> {
    return apiFetch('training-types');
}