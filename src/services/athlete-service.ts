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

export async function toggleAthleteStatus(uuid: string) {
    return await apiFetch(`/athletes/${uuid}/update-status`, {
        method: 'PATCH',
    });
}

export async function createAthlete(data: any) {
    const formData = new FormData();

    for (const key in data) {
        const value = data[key];

        if (value === undefined || value === null) continue;

        if (key === 'avatar' && value instanceof File) {
            formData.append('avatar', value);
        } else if (
            typeof value === 'object' &&
            !(value instanceof Date) &&
            !Array.isArray(value)
        ) {
            formData.append(key, JSON.stringify(value)); // ex: address
        } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value)); // ex: pains, injuries
        } else if (value instanceof Date) {
            formData.append(key, value.toISOString());
        } else if (typeof value === 'boolean' || typeof value === 'number') {
            formData.append(key, String(value));
        } else {
            formData.append(key, value);
        }
    }

    return await apiFetch('/athletes', {
        method: 'POST',
        body: formData,
    });
}

