import useSWR from 'swr';
import { getMonotonyMonitoring, MonotonyMonitoringResponse } from '../services/monitoring-service';

interface Params {
    athleteUuid: string;
    startDate: string;
    endDate: string;
}

export function useMonotonyMonitoring(params: Params) {
    const { data, error, isLoading } = useSWR<MonotonyMonitoringResponse>(
        ['monotonyMonitoring', params],
        () => getMonotonyMonitoring(params)
    );

    return {
        data,
        isLoading,
        isError: !!error,
    };
}
