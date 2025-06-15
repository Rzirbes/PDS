
import useSWR from 'swr'
import { useCoaches } from '../lib/swr'
import { coachesArraySchema } from '../zod/coach-schema'
import { getCoaches } from '../services/session-service'

export function useValidatedCoaches() {
    const { data, error, isLoading } = useSWR('coaches', getCoaches)

    return {
        coaches: data?.data ?? [],
        total: data?.total ?? 0,
        isLoading,
        isError: !!error,
    }
}
