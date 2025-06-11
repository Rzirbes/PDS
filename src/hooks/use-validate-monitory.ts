import { useMonitory } from '../lib/swr'
import { monitoryArraySchema } from '../zod/monitory-schema'

export function useValidatedMonitory() {
    const { data, error, isLoading } = useMonitory()
    const parsed = monitoryArraySchema.safeParse(data)

    return {
        monitory: parsed.success ? parsed.data : [],
        isLoading,
        error,
        isValid: parsed.success,
    }
} 