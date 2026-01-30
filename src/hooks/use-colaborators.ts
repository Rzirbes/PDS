import { mutate } from 'swr'
import { createCoach } from '../services/coach-service'

export function useCreateCoach() {
  async function handleCreateCoach(data: any) {
    console.log('[DEBUG] Payload para createCoach:', data)
    await createCoach(data)
    await mutate('coaches')
  }

  return {
    createCoach: handleCreateCoach
  }
}