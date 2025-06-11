// src/components/schedule/ScheduleComponent.tsx

import React from 'react'
import { View, Text, ScrollView } from 'react-native'

interface Training {
    id: string
    startTime: string
    endTime: string
    title: string
    notes?: string
    collaboratorId: number
    date: string
    color: string
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

type PositionedTraining = Training & {
    offset: number
    groupSize: number
}

function groupOverlappingTrainings(trainings: Training[]): PositionedTraining[] {
    const positioned: PositionedTraining[] = []
    const sorted = [...trainings].sort((a, b) => a.startTime.localeCompare(b.startTime))

    let group: Training[] = []

    const getMinutes = (time: string) => {
        const [h, m] = time.split(':').map(Number)
        return h * 60 + m
    }

    sorted.forEach((current, i) => {
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
            // processa grupo atual
            group.forEach((item, index) => {
                positioned.push({ ...item, offset: index, groupSize: group.length })
            })
            group = [current]
        }
    })
    // último grupo
    group.forEach((item, index) => {
        positioned.push({ ...item, offset: index, groupSize: group.length })
    })

    return positioned
}

export default function ScheduleComponent({ trainings, colors, coaches }: Props) {
    const PIXELS_PER_MINUTE = 1.6
    const startMinutes = 330
    const totalMinutes = 21 * 50
    const containerHeight = totalMinutes * PIXELS_PER_MINUTE


    return (<ScrollView horizontal={false} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flexDirection: 'row', marginTop: 16, minHeight: containerHeight }}>
            {/* Coluna de horários */}
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

            {/* Coluna de treinos */}
            <View style={{ flex: 1, position: 'relative' }}>
                {groupOverlappingTrainings(trainings).map((item) => {
                    const [startHour, startMin] = item.startTime.split(':').map(Number)
                    const [endHour, endMin] = item.endTime.split(':').map(Number)
                    const startTotalMin = startHour * 60 + startMin
                    const endTotalMin = endHour * 60 + endMin
                    const top = (startTotalMin - startMinutes) * PIXELS_PER_MINUTE
                    const height = (endTotalMin - startTotalMin) * PIXELS_PER_MINUTE

                    const coach = coaches.find(c => c.id === item.collaboratorId)
                    const coachColor = coach?.schedulerColor ?? '#3B82F6'

                    const CARD_WIDTH = '92%'
                    const OVERLAP_OFFSET = item.offset * 18

                    return (
                        <View
                            key={item.id}
                            style={{
                                position: 'absolute',
                                top,
                                left: OVERLAP_OFFSET,
                                width: CARD_WIDTH,
                                height,
                                backgroundColor: coachColor,
                                borderRadius: 8,
                                padding: 8,
                                justifyContent: 'center',

                                zIndex: item.offset,
                                elevation: 4, // Android
                                shadowColor: '#000', // iOS
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.4,
                                shadowRadius: 4,
                            }}
                        >
                            <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 16, color: '#fff' }}>
                                {item.title}
                            </Text>
                            <Text numberOfLines={1} style={{ color: '#fff' }}>
                                {item.startTime} - {item.endTime}
                            </Text>
                            {item.notes && (
                                <Text numberOfLines={1} style={{ fontSize: 12, color: '#fff' }}>
                                    {item.notes}
                                </Text>
                            )}
                        </View>
                    )
                })}



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
