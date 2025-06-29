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
    const coachColor = coaches.find(c => c.id === training.collaboratorId)?.schedulerColor ?? '#3B82F6'

    return (
        <Pressable
            onPress={onPress}
            style={[
                {
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
                    position: 'absolute',
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
