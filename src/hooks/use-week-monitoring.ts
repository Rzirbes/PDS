import useSWR from 'swr';
import { WeekMonitoringResponse } from '../types/week-monitoring-response';
import { getWeekMonitoring } from '../services/monitoring-service';

export function useWeekMonitoring(params: {
    athleteUuid: string;
    startDate: string;
    endDate: string;
}) {
    const { data, error, isLoading } = useSWR<WeekMonitoringResponse>(
        ['weekMonitoring', params],
        () => getWeekMonitoring(params)
    );

    return {
        data,
        isLoading,
        isError: !!error,
    };
}
