import useSWR from 'swr';
import { Athlete, AthleteDetails, createAthlete, getAthleteById, getAthletes, toggleAthleteStatus, updateAthlete } from '../services/athlete-service';
import { mutate } from 'swr';
import { showMessage } from 'react-native-flash-message';

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

    async function handleUpdateAthlete(updateData: any, id: string) {
        await updateAthlete(id, updateData);
        await mutateAthlete();
    }

    async function updateStatus() {
        try {
            const res = await toggleAthleteStatus(uuid);
            await mutateAthlete();
            showMessage({
                message: res.title,
                description: res.message,
                type: 'success',
            });
        } catch (err: unknown) {
            const error = err as { message?: string };
            showMessage({
                message: 'Erro ao atualizar status',
                description: error?.message ?? 'Tente novamente mais tarde.',
                type: 'danger',
            });
        }
    }

    return {
        athlete: data,
        isLoading,
        isError: !!error,
        updateAthlete: handleUpdateAthlete,
        updateStatus,
    };
}

export function useCreateAthlete() {
    async function handleCreateAthlete(data: any) {
        console.log('[DEBUG] Payload para createAthlete:', data);
        await createAthlete(data);
        await mutate('athletes');
    }

    return {
        createAthlete: handleCreateAthlete,
    };
}


