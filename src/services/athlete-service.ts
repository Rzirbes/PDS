import { apiFetch } from "./api";

export interface Injury {
    uuid: string,
    id: string;
    date: string;
    bodyRegion: string;
    bodySide: string;
    degree: string;
    occurredDuring: string;
    diagnosis: string;
    surgery: string;
    description: string;
}

export interface Pain {
    uuid: string,
    id: string;
    date: string;
    bodyRegion: string;
    bodySide: string;
    intensity: number;
    occurredDuring: string;
    description: string;
}

export interface Address {
    street?: string;
    neighborhood?: string;
    buildingNumber?: string;
    complement?: string;
    zipCode?: string;
    city?: string;
    state?: string;
    country?: string;

    cityId?: string;
    stateId?: string;
    countryId?: string;
}

export type AthleteClub = {
    uuid: string;
    clubId: string;
    startDate: string;
    name: string;

    countryId?: string;
    stateId?: string;
    cityId?: string;
};

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
    observation?: string;
    address?: Address;
    clubs?: AthleteClub[];
    injuries?: Injury[];
    pains?: Pain[];
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

export async function updateAthlete(uuid: string, data: any) {
    return await apiFetch(`/athletes/${uuid}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}
