import useSWR from 'swr';
import { Athlete, getAthleteById, getAthletes } from '../services/athlete-service';



export function useAthletes() {
    const { data, error, isLoading } = useSWR<{ data: Athlete[] }>('athletes', getAthletes);

    const athletes = data?.data ?? [];

    return {
        athletes,
        isLoading,
        isError: !!error,
    };
}

export function useAthleteById(uuid: string) {
    const { data, error, isLoading } = useSWR(uuid ? `athlete-${uuid}` : null, () => getAthleteById(uuid));

    return {
        athlete: data,
        isLoading,
        isError: !!error,
    };
}
