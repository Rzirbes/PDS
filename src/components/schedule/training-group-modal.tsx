import React from 'react'
import { Modal, Pressable, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import { PositionedTraining } from './schedule-component'
import { useTheme } from '../../context/theme-context'

interface Props {
    visibleGroup: PositionedTraining[] | null
    onClose: () => void
    onSelectTraining: (training: PositionedTraining) => void
    coaches: {
        id: number
        schedulerColor: string
    }[]
}

export function TrainingGroupModal({ visibleGroup, onClose, onSelectTraining, coaches }: Props) {
    const { colors } = useTheme()

    if (!visibleGroup) return null

    return (
        <Modal
            transparent
            animationType="fade"
            visible={!!visibleGroup}
            onRequestClose={onClose}
        >
            <Pressable
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 16,
                }}
                onPress={onClose}
            >
                <Pressable
                    onPress={() => { }}
                    style={{
                        backgroundColor: colors.secondary,
                        padding: 20,
                        borderRadius: 12,
                        width: '100%',
                        maxHeight: '70%',
                    }}
                >
                    <TouchableOpacity
                        onPress={onClose}
                        style={{
                            position: 'absolute',
                            top: 8,
                            right: 12,
                            zIndex: 1,
                        }}
                    >
                        <Text style={{ fontSize: 18, color: colors.text }}>✕</Text>
                    </TouchableOpacity>

                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: colors.text }}>
                        Treinos neste horário
                    </Text>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {visibleGroup.map(training => {
                            const coachColor =
                                coaches.find(c => c.id === training.collaboratorId)?.schedulerColor ?? '#3B82F6'

                            return (
                                <TouchableOpacity
                                    key={training.id}
                                    onPress={() => onSelectTraining(training)}
                                    style={{
                                        backgroundColor: coachColor,
                                        borderRadius: 8,
                                        padding: 12,
                                        marginBottom: 12,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.4,
                                        shadowRadius: 4,
                                    }}
                                >
                                    <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 14, color: colors.text }}>
                                        {training.startTime} - {training.endTime} | {training.title}
                                    </Text>

                                    <Text numberOfLines={1} style={{ color: colors.text, fontSize: 12, marginTop: 2 }}>
                                        Atleta: {training.athleteName}
                                    </Text>
                                    <Text numberOfLines={1} style={{ color: colors.text, fontSize: 12 }}>
                                        Treinador: {training.coachName}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    )
}
