import { apiFetch } from './api'

type WellBeingFieldKey =
    | 'sleep'
    | 'sleepHours'
    | 'energy'
    | 'pain'
    | 'stress'
    | 'humor'
    | 'nutrition'
    | 'waterIntake'
    | 'motivation'
    | 'fatigue';

type WellBeingField = {
    title: string;
    value: number;
};

export type GetDayWellBeingResponseDto = {
    id: string;
} & Record<WellBeingFieldKey, WellBeingField>;

export type CaptureWellBeingPayload = {
    id?: string;
    athleteId: string;
    date: Date;
} & Record<WellBeingFieldKey, number>;
function normalizeDateToApi(date: Date) {
    const adjusted = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 3));
    return adjusted;
}
export async function fetchDayWellBeing(
    athleteId: string,
    date: Date
): Promise<GetDayWellBeingResponseDto | null> {
    const normalizedDate = normalizeDateToApi(date);

    console.log('📆 fetchDayWellBeing - original:', date.toISOString());
    console.log('📆 fetchDayWellBeing - normalizado:', normalizedDate.toISOString());
    console.log('📡 URL final:',
        `monitoring/well-being/day?date=${normalizedDate.toISOString()}&athleteId=${athleteId}`
    );

    try {
        const response = await apiFetch<GetDayWellBeingResponseDto>(
            `monitoring/well-being/day?date=${normalizedDate.toISOString()}&athleteId=${athleteId}`
        );
        return response;
    } catch (error: any) {
        if (error.message?.includes('404')) {
            return null;
        }
        throw error;
    }
}


export async function captureWellBeing(payload: CaptureWellBeingPayload): Promise<void> {
    const { id, ...data } = payload;
    const endpoint = `monitoring/well-being/${id ?? 'day'}`;
    const method = id ? 'PUT' : 'POST';

    try {
        const res = await apiFetch(endpoint, {
            method,
            body: JSON.stringify(data),
        });
        console.log('✅ Bem-estar salvo com sucesso:', res);
    } catch (error) {
        console.error('❌ Erro ao capturar bem-estar:', error);
        throw new Error('Erro ao enviar dados de bem-estar');
    }
}