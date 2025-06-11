import { useAthletes } from '../lib/swr'
import { athletesArraySchema } from '../zod/athlete-schema'

export function useValidatedAthletes() {
    const { data, error, isLoading } = useAthletes()
    const parsed = athletesArraySchema.safeParse(data)

    return {
        athletes: parsed.success ? parsed.data : [],
        isLoading,
        error,
        isValid: parsed.success,
    }
}
