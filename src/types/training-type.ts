export interface TrainingType {
    id: string;
    name: string;
}
export interface PositionedTraining {
    id: number
    startTime: string
    endTime: string
    title: string
    date: Date
    color: string
    coachName: string
    athleteName: string
    athleteId: number
    collaboratorId: number
    pse?: number
    trainingPlanning?: any
    isCompleted: boolean
    offset?: number // opcional, depende de onde é usado
}

export interface Schedule {
    id: number
    start: string
    end: string
    completed?: boolean
    trainer: {
        id: number
        name: string
        schedulerColor: string
    }
    athlete: {
        id: number
        name: string
    }
    trainingPlanning?: {
        pse?: number
        trainingType?: {
            name: string
        }
    }
}