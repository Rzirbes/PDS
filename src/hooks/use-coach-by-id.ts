import useSWR from 'swr'
import { CoachDetails, getCoachById } from '../services/coach-service'

export function useCoachById(uuid: string) {
  const { data, error, isLoading } = useSWR<CoachDetails>(uuid ? `coach-${uuid}` : null, () => getCoachById(uuid))

  return {
    coach: data,
    isLoading,
    isError: !!error,
  }
}
