// src/screens/AgendaScreen.tsx

import React, { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { mockCoaches, mockSchedules, mockTrainingPlannings } from '../../mock'
import { generateWeeklyIntervalsForMonth } from '../../utils/date-utils'
import { format } from 'date-fns'
import RNPickerSelect from 'react-native-picker-select'
import { useTheme } from '../../context/ThemeContext'
import { ptBR } from 'date-fns/locale'
import WeekDaySelector from '../../components/schedule/week-day-selector'
import ScheduleComponent from '../../components/schedule/schedule-component'

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

export function useUser() {
    return {
        user: {
            role: 'ADMIN', // ou 'COLLABORATOR'
            id: 1
        }
    }
}

export default function ScheduleScreen() {
    const { user } = useUser()
    const isAdmin = user.role === 'ADMIN'
    const { colors } = useTheme()

    const screenWidth = Dimensions.get('window').width
    const horizontalPadding = 16 * 2 // paddingHorizontal do container
    const dayMargin = 1 * 2 // marginHorizontal * 2 por item
    const columns = 8

    const dayWidth = (screenWidth - horizontalPadding - (dayMargin * columns)) / columns


    const [selectedDay, setSelectedDay] = useState<string | null>(null)

    const weeklyRanges = generateWeeklyIntervalsForMonth()
    const [selectedWeekIndex, setSelectedWeekIndex] = useState(0)
    const selectedWeek = weeklyRanges[selectedWeekIndex]
    const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<number | null>(null)


    const trainings = mockSchedules
        .filter((schedule) => {
            const trainingDate = new Date(schedule.start)
            const inSelectedWeek = trainingDate >= selectedWeek.startDate && trainingDate < selectedWeek.endDate
            const matchesDay = !selectedDay || format(trainingDate, 'yyyy-MM-dd') === selectedDay
            const matchesCollaborator = isAdmin
                ? !selectedCollaboratorId || schedule.coach.id === selectedCollaboratorId
                : schedule.coach.id === user.id
            return inSelectedWeek && matchesDay && matchesCollaborator
        })
        .map((schedule) => {
            return {
                id: String(schedule.id),
                startTime: format(schedule.start, 'HH:mm'),
                endTime: format(schedule.end, 'HH:mm'),
                title: schedule.trainingPlanning.title,
                notes: undefined, // ou algo como: schedule.notes se tiver
                collaboratorId: schedule.coach.id,
                date: format(schedule.start, 'yyyy-MM-dd'),
                color: schedule.coach.schedulerColor,
            }
        })

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 16, paddingTop: 50 }}>
            {/* Header - Dias da semana */}
            <WeekDaySelector
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
                startDate={selectedWeek.startDate}
            />

            {/* Filtro de colaborador (somente admin) */}
            {isAdmin && (
                <View style={{ zIndex: 999 }}>
                    <RNPickerSelect
                        onValueChange={(value) => setSelectedCollaboratorId(value)}
                        value={selectedCollaboratorId}
                        items={[
                            { label: 'Todos', value: null },
                            ...mockCoaches.map(coach => ({
                                label: coach.name,
                                value: coach.id,
                            })),
                        ]}
                        placeholder={{ label: 'Filtrar por colaborador...', value: null }}
                        useNativeAndroidPickerStyle={false}
                        style={{
                            inputIOS: {
                                padding: 16,
                                borderRadius: 8,
                                backgroundColor: colors.secondary,
                                color: colors.text,
                            },
                            inputAndroid: {
                                padding: 12,
                                borderRadius: 8,
                                backgroundColor: colors.secondary,
                                color: colors.text,
                            },
                            iconContainer: {
                                top: 15,
                                right: 12,
                            },
                            placeholder: {
                                color: colors.muted,
                            },
                        }}
                        Icon={() => (
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: colors.text, fontSize: 18 }}>▼</Text>
                            </View>
                        )}
                    />
                </View>
            )}

            {/* Lista de treinos */}
            <ScheduleComponent trainings={trainings} colors={colors} coaches={mockCoaches} />


        </View>
    )
}

