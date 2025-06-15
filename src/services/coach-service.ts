// src/services/coach-service.ts
import { apiFetch } from './api';

export interface Coach {
    id: number;
    name: string;
    email: string;
    isEnabled: boolean;
}

export interface GetCoachesResponse {
    total: number;
    data: Coach[];
}

export async function getCoaches(): Promise<GetCoachesResponse> {
    return apiFetch('coaches');
}

export interface CoachDetails {
    id: number;
    name: string;
    email: string;
    role: string;
    phone?: string;
    address?: {
        cep?: string;
        street?: string;
        number?: string;
        neighborhood?: string;
        complement?: string;
        country?: string;
        state?: string;
        city?: string;
    };
    schedulerColor?: string;
}

export async function getCoachById(uuid: string): Promise<CoachDetails> {
    return apiFetch(`coaches/${uuid}`);
}
