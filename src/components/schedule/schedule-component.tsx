// src/components/schedule/ScheduleComponent.tsx

import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { TrainingCard } from './training-card'
import { TrainingGroupModal } from './training-group-modal'

interface Training {
    id: string
    startTime: string
    endTime: string
    title: string
    notes?: string
    collaboratorId: number
    date: string
    color: string
    coachName: string
    athleteName: string
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

function groupOverlappingTrainings(trainings: Training[]): PositionedTraining[][] {
    const groups: PositionedTraining[][] = []
    const sorted = [...trainings].sort((a, b) => a.startTime.localeCompare(b.startTime))
    let group: Training[] = []

    const getMinutes = (time: string) => {
        const [h, m] = time.split(':').map(Number)
        return h * 60 + m
    }

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

export default function ScheduleComponent({ trainings, colors, coaches }: Props) {
    const PIXELS_PER_MINUTE = 1.6
    const startMinutes = 330
    const totalMinutes = 21 * 50
    const containerHeight = totalMinutes * PIXELS_PER_MINUTE
    const [visibleGroup, setVisibleGroup] = React.useState<PositionedTraining[] | null>(null)

    return (
        <ScrollView horizontal={false} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flexDirection: 'row', marginTop: 16, minHeight: containerHeight }}>
                <View style={{ width: 60, paddingRight: 8 }}>
                    {Array.from({ length: 22 }, (_, i) => {
                        const totalMin = 330 + i * 50
                        const hour = Math.floor(totalMin / 60).toString().padStart(2, '0')
                        const min = (totalMin % 60).toString().padStart(2, '0')
                        return (
                            <View key={i} style={{ height: 50 * PIXELS_PER_MINUTE, justifyContent: 'center' }}>
                                <Text style={{ color: colors.muted, fontSize: 12 }}>{`${hour}:${min}`}</Text>
                            </View>
                        )
                    })}
                </View>

                <View style={{ flex: 1, position: 'relative' }}>
                    {groupOverlappingTrainings(trainings).map((group, index) => (
                        <React.Fragment key={index}>
                            {group.map((item, innerIndex) => (
                                <TrainingCard
                                    key={`${item.id}-${innerIndex}`}
                                    group={[item]}
                                    coaches={coaches}
                                    onPress={() => setVisibleGroup(group)}
                                />
                            ))}
                        </React.Fragment>
                    ))}

                    <TrainingGroupModal
                        visibleGroup={visibleGroup}
                        onClose={() => setVisibleGroup(null)}
                    />

                    {trainings.length === 0 && (
                        <Text style={{ textAlign: 'center', marginTop: 40, color: colors.muted }}>
                            Nenhum treino encontrado
                        </Text>
                    )}
                </View>
            </View>
        </ScrollView>
    )
}
