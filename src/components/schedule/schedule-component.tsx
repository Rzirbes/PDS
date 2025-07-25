import React from 'react'
import { View, Text, ScrollView, ViewStyle } from 'react-native'
import { TrainingCard } from './training-card'
import { TrainingGroupModal } from './training-group-modal'
import { TrainingDetailsModal } from './training-detail-modal'

export interface Training {
    id: string
    startTime: string
    endTime: string
    title: string
    notes?: string
    collaboratorId: number
    date: string
    athleteId: string;
    color: string
    coachName: string
    athleteName: string
    pse?: number;
    isCompleted?: boolean
    trainingPlanning: {id: string, trainingType: { id: string } }

}


interface Props {
    trainings: Training[]
    colors: {
        text: string
        muted: string
    },
    coaches: {
        id: number
        schedulerColor: string
    }[]
}

export type PositionedTraining = Training & {
    offset: number
    groupSize: number
}

const PIXELS_PER_MINUTE = 1.6
const startMinutes = 330
const totalMinutes = 21 * 50
const containerHeight = totalMinutes * PIXELS_PER_MINUTE

function getMinutes(time: string) {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
}

function calculatePosition(startTime: string) {
    const minutesFromStart = getMinutes(startTime) - startMinutes
    return minutesFromStart * PIXELS_PER_MINUTE
}

function groupOverlappingTrainings(trainings: Training[]): PositionedTraining[][] {
    const groups: PositionedTraining[][] = []
    const sorted = [...trainings].sort((a, b) => a.startTime.localeCompare(b.startTime))
    let group: Training[] = []

    sorted.forEach((current) => {
        if (group.length === 0) {
            group.push(current)
            return
        }

        const last = group[group.length - 1]
        const endLast = getMinutes(last.endTime)
        const startCurrent = getMinutes(current.startTime)

        if (startCurrent < endLast) {
            group.push(current)
        } else {
            groups.push(group.map((item, idx) => ({ ...item, offset: idx, groupSize: group.length })))
            group = [current]
        }
    })

    if (group.length) {
        groups.push(group.map((item, idx) => ({ ...item, offset: idx, groupSize: group.length })))
    }

    return groups
}
function calculateHeight(startTime: string, endTime: string) {
    const start = getMinutes(startTime)
    const end = getMinutes(endTime)
    return (end - start) * PIXELS_PER_MINUTE
}
export default function ScheduleComponent({ trainings, colors, coaches }: Props) {
    const [visibleGroup, setVisibleGroup] = React.useState<PositionedTraining[] | null>(null)
    const [visibleTraining, setVisibleTraining] = React.useState<PositionedTraining | null>(null)
    console.log("Console.log do schedule componete: " + visibleTraining?.title)
    function handleOpenTrainingDetails(training: PositionedTraining) {
        setVisibleTraining(training)
    }

    return (
        <ScrollView horizontal={false} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flexDirection: 'row', marginTop: 16, minHeight: containerHeight }}>
                {/* Coluna com as horas */}
                <View style={{ width: 60, paddingRight: 8 }}>
                    {Array.from({ length: 21 }, (_, i) => {
                        const totalMin = startMinutes + i * 50
                        const hour = Math.floor(totalMin / 60).toString().padStart(2, '0')
                        const min = (totalMin % 60).toString().padStart(2, '0')

                        return (
                            <View
                                key={i}
                                style={{
                                    height: 50 * PIXELS_PER_MINUTE, justifyContent: 'flex-start', borderTopWidth: 0.5,
                                    borderColor: '#333',
                                }}
                            >
                                <Text style={{ color: colors.muted, fontSize: 12 }}>{`${hour}:${min}`}</Text>
                            </View>
                        )
                    })}
                </View>

                {/* Área dos Treinos */}
                <View style={{ flex: 1, position: 'relative' }}>
                    {Array.from({ length: 21 }, (_, i) => (
                        <View
                            key={`line-${i}`}
                            style={{
                                position: 'absolute',
                                top: i * 50 * PIXELS_PER_MINUTE,
                                left: 0,
                                right: 0,
                                height: 0.5,
                                backgroundColor: '#333',
                            }}
                        />
                    ))}
                    {groupOverlappingTrainings(trainings).map((group, index) => (
                        <React.Fragment key={index}>
                            {group.map((item, innerIndex) => (
                                <TrainingCard
                                    key={`${item.id}-${innerIndex}`}
                                    training={item}
                                    onPress={() => {
                                        if (group.length > 1) {
                                            setVisibleGroup(group)
                                        } else {
                                            handleOpenTrainingDetails(item)
                                        }
                                    }}
                                    coaches={coaches}
                                    groupSize={group.length}
                                    isTopCard={innerIndex === group.length - 1}
                                    style={{
                                        position: 'absolute',
                                        top: calculatePosition(item.startTime),
                                        height: calculateHeight(item.startTime, item.endTime),
                                        left: `${(item.offset / item.groupSize) * 100}%`,
                                        width: `${100 / item.groupSize}%`,
                                    }}
                                />
                            ))}
                        </React.Fragment>
                    ))}

                    {/* Modal de Grupo */}
                    <TrainingGroupModal
                        visibleGroup={visibleGroup}
                        onClose={() => setVisibleGroup(null)}
                        onSelectTraining={(training) => {
                            setVisibleGroup(null)
                            setTimeout(() => {
                                setVisibleTraining(training)
                            }, 150)
                        }}
                        coaches={coaches}
                    />

                    {/* Mensagem de vazio */}
                    {trainings.length === 0 && (
                        <Text style={{ textAlign: 'center', marginTop: 40, color: colors.muted }}>
                            Nenhum treino encontrado
                        </Text>
                    )}

                    {/* Modal de Detalhes */}
                    <TrainingDetailsModal
                        visibleTraining={visibleTraining}
                        onClose={() => setVisibleTraining(null)}
                    />
                </View>
            </View>
        </ScrollView>
    )
}
