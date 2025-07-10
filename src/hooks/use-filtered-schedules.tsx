import { format, isWithinInterval, parseISO } from "date-fns";
import { getWeekInterval } from "../utils/date-utils";
import { useSchedules } from "./use-schedule";

export function useFilteredSchedules({
    selectedDate,
    selectedDay,
    selectedCollaboratorId,
    user
}: {
    selectedDate: Date;
    selectedDay: string;
    selectedCollaboratorId: number | null;
    user: { role: string; id: number };
}) {
    const weekInterval = getWeekInterval(selectedDate);
    const { schedules, isLoading, error } = useSchedules(weekInterval.startDate, weekInterval.endDate);

    const isAdmin = user.role === 'ADMIN';

    const filtered = schedules
        .filter((schedule: any) => {
            const trainingDate = new Date(schedule.start);
            const trainingDateFormatted = format(trainingDate, 'yyyy-MM-dd');

            const inSelectedWeek = isWithinInterval(trainingDate, {
                start: weekInterval.startDate,
                end: weekInterval.endDate,
            });

            const matchesDay = selectedDay ? trainingDateFormatted === selectedDay : true;

            const matchesCollaborator = isAdmin
                ? !selectedCollaboratorId || schedule.trainer.id === selectedCollaboratorId
                : schedule.trainer.id === user.id;

            return inSelectedWeek && matchesDay && matchesCollaborator;
        })
        .map((schedule: any) => ({
            id: schedule.id,
            startTime: format(parseISO(schedule.start), 'HH:mm'),
            endTime: format(parseISO(schedule.end), 'HH:mm'),
            title: schedule.trainingPlanning?.trainingType?.name || '',
            date: parseISO(schedule.start),
            color: schedule.trainer.schedulerColor || '#ccc',
            coachName: schedule.trainer.name,
            athleteName: schedule.athlete.name,
            athleteId: schedule.athlete.id,
            collaboratorId: schedule.trainer.id,
            pse: schedule.trainingPlanning?.pse,
            trainingPlanning: schedule.trainingPlanning,
            isCompleted: schedule.completed ?? false,
        }));

    return {
        trainings: filtered,
        isLoading,
        error,
        weekInterval,
    };
}
