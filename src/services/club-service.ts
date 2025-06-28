import { apiFetch } from "./api";

export interface Club {
    id: string;
    name: string;
    cityId: string;
}


export interface CreateClubDto {
    name: string;
    countryId: string;
    stateId: string;
    cityId: string;
}

export async function getClubsByCity(cityId: string): Promise<Club[]> {
    const res = await apiFetch<{ clubs: { value: string; label: string }[] }>(`clubs?city=${cityId}`);
    return res.clubs.map((item) => ({
        id: item.value,
        name: item.label,
        cityId,
    }));
}

export async function createClub(data: CreateClubDto): Promise<{ id: string }> {
    const res = await apiFetch<{ message: string; id: string }>('/clubs', {
        method: 'POST',
        body: JSON.stringify(data),
    });

    return { id: res.id };
}
