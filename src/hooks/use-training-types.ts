import useSWR from 'swr';
import { getTrainingTypes } from '../services/training-type-service';



export function useTrainingTypes() {
    const { data, error, isLoading } = useSWR('training-types', getTrainingTypes);

    return {
        trainingTypes: data?.data ?? [],
        isLoading,
        isError: !!error,
    };
}