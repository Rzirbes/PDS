// src/components/schedule/TrainingCard.tsx

import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { PositionedTraining } from './schedule-component'

interface Props {
    group: PositionedTraining[]
    onPress: () => void
    coaches: {
        id: number
        schedulerColor: string
    }[]
}

export function TrainingCard({ group, onPress, coaches }: Props) {
    const item = group[0]
    const PIXELS_PER_MINUTE = 1.6
    const startMinutes = 330

    const [startHour, startMin] = item.startTime.split(':').map(Number)
    const [endHour, endMin] = item.endTime.split(':').map(Number)
    const startTotalMin = startHour * 60 + startMin
    const endTotalMin = endHour * 60 + endMin

    const top = (startTotalMin - startMinutes) * PIXELS_PER_MINUTE
    const height = (endTotalMin - startTotalMin) * PIXELS_PER_MINUTE
    const coachColor = coaches.find(c => c.id === item.collaboratorId)?.schedulerColor ?? '#3B82F6'

    return (
        <Pressable
            onPress={onPress}
            style={{
                position: 'absolute',
                top,
                left: item.offset * 18,
                width: '92%',
                height,
                backgroundColor: coachColor,
                borderRadius: 8,
                padding: 8,
                justifyContent: 'center',
                zIndex: item.offset,
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 4,
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                <Text
                    numberOfLines={1}
                    style={{ fontWeight: 'bold', fontSize: 14, color: '#fff', marginRight: 6 }}
                >
                    {item.startTime} - {item.title}
                </Text>

                {group.length > 1 && (
                    <View
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.6)',
                            paddingHorizontal: 6,
                            paddingVertical: 4,
                            borderRadius: 6,
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>+{group.length - 1}</Text>
                    </View>
                )}
            </View>

            <Text numberOfLines={1} style={{ color: '#fff', fontSize: 12 }}>
                Atleta: {item.athleteName}
            </Text>
            <Text numberOfLines={1} style={{ color: '#fff', fontSize: 12 }}>
                Treinador: {item.coachName}
            </Text>
        </Pressable>
    )
}