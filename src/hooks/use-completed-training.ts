import useSWR from 'swr'
import { getCompletedTrainingsByAthlete, Training } from '../services/training-service'

export function useCompletedTrainings(athleteUuid: string, start: Date, end: Date) {
    const shouldFetch = Boolean(athleteUuid && start && end)

    const { data, error, isLoading } = useSWR<Training[]>(
        shouldFetch ? ['completedTrainings', athleteUuid, start.toISOString(), end.toISOString()] : null,
        () => getCompletedTrainingsByAthlete(athleteUuid, start, end),
        {
            revalidateOnFocus: false,
            refreshInterval: 0,
        }
    )

    return {
        trainings: data || [],
        isLoading,
        isError: !!error,
    }
}
