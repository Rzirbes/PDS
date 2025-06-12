// src/components/schedule/TrainingGroupModal.tsx

import React from 'react'
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'
import { PositionedTraining } from './schedule-component'

interface Props {
    visibleGroup: PositionedTraining[] | null
    onClose: () => void
}

export function TrainingGroupModal({ visibleGroup, onClose }: Props) {
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
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 16,
                }}
                onPress={onClose}
            >
                <Pressable
                    onPress={() => { }}
                    style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 12,
                        width: '100%',
                        maxHeight: '70%',
                        position: 'relative',
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
                        <Text style={{ fontSize: 18 }}>✕</Text>
                    </TouchableOpacity>

                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Treinos neste horário</Text>

                    {visibleGroup?.map(training => (
                        <View key={training.id} style={{ marginBottom: 12 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
                                {training.title}
                            </Text>
                            <Text style={{ color: '#888', marginBottom: 2 }}>
                                {training.startTime} - {training.endTime}
                            </Text>
                            <Text>
                                Atleta: <Text style={{ fontWeight: '600' }}>{training.athleteName}</Text>
                            </Text>
                            <Text>
                                Colaborador: <Text style={{ fontWeight: '600' }}>{training.coachName}</Text>
                            </Text>
                            <View
                                style={{
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#eee',
                                    paddingBottom: 12,
                                    marginBottom: 12,
                                }}
                            />
                        </View>
                    ))}
                </Pressable>
            </Pressable>
        </Modal>
    )
}