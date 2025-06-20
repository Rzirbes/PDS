// src/services/coach-service.ts
import { apiFetch } from './api';

export interface Coach {
    id: number;
    uuid: string;
    name: string;
    email: string;
    isEnabled: boolean;
}

export interface GetCoachesResponse {
    total: number;
    data: Coach[];
}


export interface CoachDetails {
    id: number;
    name: string;
    email: string;
    role: string;
    phone?: string;
    address?: {
        zipCode ?: string;
        street?: string;
        buildingNumber ?: string;
        neighborhood?: string;
        complement?: string;
        countryId?: string;
        stateId?: string;
        cityId?: string;
    };
    schedulerColor?: string;
}

export async function getCoaches(): Promise<GetCoachesResponse> {
    return apiFetch<GetCoachesResponse>('coaches');
}

export async function getCoachById(uuid: string): Promise<CoachDetails> {
    return apiFetch<CoachDetails>(`coaches/${uuid}`);
}
