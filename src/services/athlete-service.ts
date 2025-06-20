import { apiFetch } from "./api";

export interface AthleteDetails {
    id: string;
    name: string;
    email: string;
    birthday: string;
    height: number;
    weight: number;
    isEnabled: boolean;
    cpf?: string;
    phone?: string;
    bestSkill?: string;
    worstSkill?: string;
    goal?: string;
    dominantFoot?: string;
    positions?: string[];
    isMonitorDaily?: boolean;
}

export interface Athlete {
    id: string;
    name: string;
    email?: string;
    isEnabled?: boolean;
}

export async function getAthletes(): Promise<{ data: Athlete[] }> {
    return await apiFetch<{ data: Athlete[] }>('/athletes');
}

export async function getAthleteById(uuid: string): Promise<AthleteDetails> {
    return await apiFetch<AthleteDetails>(`/athletes/${uuid}`);
}