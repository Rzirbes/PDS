import { InjuryContext } from "../types/enums";
import { BodySide } from "../types/enums";


export const mockPainReports = [
    {
        id: 1,
        uuid: 'pain-001',
        createdAt: new Date('2024-04-01T08:00:00Z'),
        updatedAt: new Date('2024-04-01T08:00:00Z'),
        date: new Date('2024-04-01'),
        athleteId: 1,
        trainingId: 10,
        intensity: 6,
        bodyRegion: 'Joelho',
        bodySide: BodySide.RIGHT,
        occurredDuring: InjuryContext.TRAINING,
        description: 'Dor leve após treino de perna',
    },
    {
        id: 2,
        uuid: 'pain-002',
        createdAt: new Date('2024-04-03T09:30:00Z'),
        updatedAt: new Date('2024-04-03T09:30:00Z'),
        date: new Date('2024-04-03'),
        athleteId: 2,
        trainingId: 12,
        intensity: 8,
        bodyRegion: 'Ombro',
        bodySide: BodySide.LEFT,
        occurredDuring: InjuryContext.WARMUP,
        description: 'Desconforto durante o aquecimento com halteres',
    },
    {
        id: 3,
        uuid: 'pain-003',
        createdAt: new Date('2024-04-05T10:00:00Z'),
        updatedAt: new Date('2024-04-05T10:00:00Z'),
        date: new Date('2024-04-05'),
        athleteId: 1,
        trainingId: 13,
        intensity: 4,
        bodyRegion: 'Tornozelo',
        bodySide: BodySide.RIGHT,
        occurredDuring: InjuryContext.GAME,
        description: 'Leve incômodo após jogo recreativo',
    },
]
