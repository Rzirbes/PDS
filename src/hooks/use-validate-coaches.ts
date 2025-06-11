// hooks/use-validated-coaches.ts
import { useCoaches } from '../lib/swr'
import { coachesArraySchema } from '../zod/coach-schema'

export function useValidatedCoaches() {
    const { data, error, isLoading } = useCoaches()
    const parsed = coachesArraySchema.safeParse(data)

    return {
        coaches: parsed.success ? parsed.data : [],
        isLoading,
        error,
        isValid: parsed.success,
    }
}
