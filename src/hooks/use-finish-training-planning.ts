// hooks/use-finish-training-planning.ts
import { useState } from 'react';
import { finishTrainingPlanning } from '../services/training-planning-service';

export function useFinishTrainingPlanning() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async (trainingUuid: string) => {
        setLoading(true);
        setError(null);

        try {
            await finishTrainingPlanning(trainingUuid);
        } catch (err: any) {
            setError(err.message || 'Erro ao finalizar planejamento');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        submit,
        loading,
        error,
    };
}
