import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import {
    captureWellBeing,
    CaptureWellBeingPayload,
    fetchDayWellBeing,
    GetDayWellBeingResponseDto,
} from '../services/well-being-service'

function normalizeDateToApi(date: Date) {
    const adjusted = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 3));
    return adjusted;
}

type WellBeingField = {
    title: string
    value: number
}

export function useDayWellBeing(athleteId?: string, date?: Date) {
    const isValid = athleteId && date instanceof Date && !isNaN(date.getTime());

    const normalizedDate = date ? normalizeDateToApi(date) : null;

    const cacheKey = isValid
        ? [`athlete-${athleteId}-well-being-${normalizedDate?.toISOString()}`, athleteId, normalizedDate]
        : null;

    const { data, ...props } = useSWR<GetDayWellBeingResponseDto | null>(
        cacheKey,
        () => fetchDayWellBeing(athleteId!, normalizedDate!)
    );

    const summary = data
        ? Object.entries(data)
            .filter(([key]) => key !== 'id')
            .map(([key, obj]) => ({
                label: key,
                value: (obj as WellBeingField).value,
            }))
        : [];

    return {
        ...props,
        data,
        summary,
        hasWellBeing: !!data,
    };
}




export function useCaptureWellBeing() {
    const {
        trigger,
        isMutating,
        error,
    } = useSWRMutation<void, any, string, CaptureWellBeingPayload>(
        'monitoring/well-being',
        (_key, { arg }) => captureWellBeing(arg)
    );

    return {
        submit: trigger,
        loading: isMutating,
        error,
    };
}
