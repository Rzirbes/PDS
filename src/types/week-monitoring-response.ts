export interface WeekMonitoringResponse {
  days: string[];
  trainings: {
    performed: number[];
    planned: number[];
  };
  durations: {
    performed: number[];
    planned: number[];
  };
  PSEs: {
    performed: number[];
    planned: number[];
  };
  PSRs: number[];
}
