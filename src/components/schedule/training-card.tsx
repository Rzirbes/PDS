import React from 'react'
import { Pressable, Text, View, ViewStyle } from 'react-native'
import { PositionedTraining } from './schedule-component'

interface Props {
    training: PositionedTraining
    onPress: () => void
    coaches: {
        id: number
        schedulerColor: string
    }[]
    groupSize: number
    isTopCard: boolean
    style?: ViewStyle
}

export function TrainingCard({ training, onPress, coaches, groupSize, isTopCard, style }: Props) {
    const PIXELS_PER_MINUTE = 1.6
    const startMinutes = 330
    const OFFSET_STEP = 18

    const [startHour, startMin] = training.startTime.split(':').map(Number)
    const [endHour, endMin] = training.endTime.split(':').map(Number)
    const startTotalMin = startHour * 60 + startMin
    const endTotalMin = endHour * 60 + endMin

    const top = (startTotalMin - startMinutes) * PIXELS_PER_MINUTE
    const rawHeight = (endTotalMin - startTotalMin) * PIXELS_PER_MINUTE
    const height = Math.max(rawHeight, 30)

    const coachColor = coaches.find(c => c.id === training.collaboratorId)?.schedulerColor ?? '#3B82F6'

    const isBottomCard = training.offset === groupSize - 1
    const calculatedLeft = isBottomCard ? 0 : (OFFSET_STEP * (groupSize - 1 - training.offset))

    return (
        <Pressable
            onPress={onPress}
            style={[
                {
                    position: 'absolute',
                    top,
                    left: calculatedLeft,
                    width: '92%',
                    height,
                    backgroundColor: coachColor,
                    borderRadius: 8,
                    padding: 8,
                    justifyContent: 'center',
                    zIndex: 100 - training.offset,
                    elevation: 4,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.4,
                    shadowRadius: 4,
                    opacity: isTopCard ? 1 : 0.85,
                },
                style,
            ]}
        >
            <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 14, color: '#fff', marginBottom: 2 }}>
                {training.startTime} - {training.title}
            </Text>

            <Text numberOfLines={1} style={{ color: '#fff', fontSize: 12 }}>
                Atleta: {training.athleteName}
            </Text>
            <Text numberOfLines={1} style={{ color: '#fff', fontSize: 12 }}>
                Treinador: {training.coachName}
            </Text>
        </Pressable>
    )
}
