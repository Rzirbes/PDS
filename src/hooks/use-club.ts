import useSWR from "swr";
import { Club, getClubsByCity } from "../services/club-service";

export function useClubsByCity(cityId: string | null | undefined) {
    return useSWR<Club[]>(
        cityId ? `clubs-${cityId}` : null,
        () => getClubsByCity(cityId!),
        { revalidateOnFocus: false }
    );
}