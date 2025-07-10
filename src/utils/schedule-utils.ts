import { format } from "date-fns";
import { PositionedTraining } from "../components/schedule/schedule-component";

export function mapScheduleToTraining(schedule: any): PositionedTraining {
    return {
        id: schedule.id,
        startTime: format(new Date(schedule.start), 'HH:mm'),
        endTime: format(new Date(schedule.end), 'HH:mm'),
        title: schedule.trainingPlanning?.trainingType?.name || '',
        date: new Date(schedule.start).toISOString(),
        color: schedule.trainer.schedulerColor || '#ccc',
        coachName: schedule.trainer.name,
        athleteName: schedule.athlete.name,
        athleteId: schedule.athlete.id,
        collaboratorId: schedule.trainer.id,
        pse: schedule.trainingPlanning?.pse,
        trainingPlanning: schedule.trainingPlanning,
        isCompleted: schedule.completed ?? false,
        offset: 0,
        groupSize: 1,
    }
}
