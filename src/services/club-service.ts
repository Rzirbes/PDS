import { apiFetch } from "./api";

export interface Club {
    id: string;
    name: string;
    cityId: string;
}

export async function getClubsByCity(cityId: string): Promise<Club[]> {
    const res = await apiFetch<{ clubs: { value: string; label: string }[] }>(`clubs?cityId=${cityId}`);
    return res.clubs.map((item) => ({
        id: item.value,
        name: item.label,
        cityId,
    }));
}
