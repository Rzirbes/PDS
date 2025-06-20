import useSWR from 'swr';
import { Athlete, AthleteDetails, getAthleteById, getAthletes, updateAthlete } from '../services/athlete-service';
import { mutate } from 'swr';

export function useAthletes() {
    const { data, error, isLoading } = useSWR<{ data: Athlete[] }>('athletes', getAthletes);

    const athletes = data?.data ?? [];

    return {
        athletes,
        isLoading,
        isError: !!error,
        mutateAthletes: () => mutate('athletes'),
    };
}

export function useAthleteById(uuid: string) {
    const key = uuid ? `athlete-${uuid}` : null;
    const { data, error, isLoading, mutate: mutateAthlete } = useSWR<AthleteDetails>(key, () => getAthleteById(uuid));

    async function handleUpdateAthlete(updateData: any) {
        if (!uuid) return;
        await updateAthlete(uuid, updateData);
        await mutateAthlete(); 
    }

    return {
        athlete: data,
        isLoading,
        isError: !!error,
        updateAthlete: handleUpdateAthlete,
    };
}
