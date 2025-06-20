import { apiFetch } from './api';

export interface WeekMonitoringResponse {
    days: string[];
    PSRs: number[];
    durations: {
        planned: number[];
        performed: number[];
    };
    trainings: {
        planned: number[];
        performed: number[];
    };
    PSEs: {
        planned: number[];
        performed: number[];
    };
}

export interface MonotonyMonitoringResponse {
    week: string[];
    monotony: number[];
    strain: number[];
    acuteChronicLoadRatio: number[];
    load: {
        planned: number[];
        performed: number[];
    };
}

export async function getWeekMonitoring(params: {
    athleteUuid: string;
    startDate: string;
    endDate: string;
}): Promise<WeekMonitoringResponse> {
    const query = new URLSearchParams(params).toString();
    return await apiFetch<WeekMonitoringResponse>(`/monitoring/week?${query}`);
}

export async function getMonotonyMonitoring(params: {
    athleteUuid: string;
    startDate: string;
    endDate: string;
}): Promise<MonotonyMonitoringResponse> {
    const query = new URLSearchParams(params).toString();
    return await apiFetch<MonotonyMonitoringResponse>(`/monitoring/monotony?${query}`);
}
