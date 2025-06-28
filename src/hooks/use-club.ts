import useSWR from "swr";
import { Club, createClub, CreateClubDto, getClubsByCity } from "../services/club-service";

export function useClubsByCity(cityId: string | null | undefined) {
    return useSWR<Club[]>(
        cityId ? `clubs?city=${cityId}` : null,
        () => getClubsByCity(cityId!),
        { revalidateOnFocus: false }
    );
}

export function useCreateClub() {
    async function submit(data: CreateClubDto): Promise<{ id: string } | null> {
        try {
            const result = await createClub(data);
            return result;
        } catch (err: any) {
            throw new Error(err?.message ?? 'Erro ao criar clube');
        }
    }

    return { submit };
}