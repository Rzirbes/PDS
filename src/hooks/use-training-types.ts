import useSWR from 'swr';
import { createTrainingType, CreateTrainingTypePayload, getTrainingTypes } from '../services/training-type-service';
import { useCallback } from 'react';

export const TRAINING_TYPES_KEY = 'training-types'

export function useTrainingTypes() {
  const { data, error, isLoading, mutate } = useSWR(TRAINING_TYPES_KEY, getTrainingTypes)

  return {
    trainingTypes: data?.data ?? [],
    isLoading,
    isError: !!error,
    refresh: () => mutate()
  }
}


export function useCreateTrainingType() {
  const create = useCallback(async (payload: CreateTrainingTypePayload) => {
    return createTrainingType(payload)
  }, [])

  return { createTrainingType: create }
}
