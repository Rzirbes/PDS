// src/screens/AgendaScreen.tsx

import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { mockCoaches, mockSchedules, mockTrainingPlannings } from '../../mock'
import { generateWeeklyIntervalsForMonth, getWeekInterval } from '../../utils/date-utils'
import { addDays, format, getMinutes, isWithinInterval, parseISO } from 'date-fns'
import WeekDaySelector from '../../components/schedule/week-day-selector'
import ScheduleComponent from '../../components/schedule/schedule-component'
import CollaboratorPicker from '../../components/ui/collaborator-picker'
import { useTheme } from '../../context/theme-context'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react-native'
import { RootStackParamList } from '../../navigation/types'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSchedules } from '../../hooks/use-schedule'
import { DatePickerInput } from '../../components/ui/date-picker-input'
import { useValidatedCoaches } from '../../hooks/use-validate-coaches'




export function useUser() {
    return {
        user: {
            role: 'ADMIN',
            id: 1
        }
    }
}

export default function ScheduleScreen() {
    const { user } = useUser()
    const isAdmin = user.role === 'ADMIN'
    const { colors } = useTheme()

    const { coaches, isLoading: loadingCoaches } = useValidatedCoaches()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<number | null>(null)
    const [weekInterval, setWeekInterval] = useState(getWeekInterval(new Date()));


    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(format(new Date(), 'yyyy-MM-dd'));
    console.log('🔍 Semana atual:', {
        start: weekInterval.startDate.toISOString(),
        end: weekInterval.endDate.toISOString(),
    })
    const { schedules, isLoading } = useSchedules(weekInterval.startDate, weekInterval.endDate)
    console.log(schedules)
    const trainings = schedules
        .filter((schedule: any) => {
            const trainingDate = new Date(schedule.start)
            const trainingDateFormatted = format(trainingDate, 'yyyy-MM-dd')

            const inSelectedWeek = isWithinInterval(trainingDate, {
                start: weekInterval.startDate,
                end: weekInterval.endDate,
            })
            const matchesDay = selectedDay
                ? trainingDateFormatted === selectedDay
                : true

            const matchesCollaborator = isAdmin
                ? !selectedCollaboratorId || schedule.trainer.id === selectedCollaboratorId
                : schedule.trainer.id === user.id

            return inSelectedWeek && matchesDay && matchesCollaborator
        })
        .map((schedule: any) => ({
            id: schedule.id,
            startTime: format(parseISO(schedule.start), 'HH:mm'),
            endTime: format(parseISO(schedule.end), 'HH:mm'),
            title: schedule.trainingPlanning?.description || '',
            date: parseISO(schedule.start),
            color: schedule.trainer.schedulerColor || '#ccc',
            coachName: schedule.trainer.name,
            athleteName: schedule.athlete.name,
            athleteId: schedule.athlete.id,
            collaboratorId: schedule.trainer.id,
            pse: schedule.trainingPlanning?.pse,
        }))

    useEffect(() => {
        const newInterval = getWeekInterval(selectedDate);
        setWeekInterval(newInterval);
    }, [selectedDate]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 16, paddingTop: 50 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>

                <TouchableOpacity onPress={() => setSelectedDate(prev => addDays(prev, -7))}>
                    <ChevronLeft color={colors.primary} size={24} style={{ marginHorizontal: 12 }} />
                </TouchableOpacity>


                <View style={{ flex: 1 }}>
                    <DatePickerInput
                        label="Semana de"
                        value={selectedDate}
                        onChange={(date) => {
                            setSelectedDate(date)
                            setSelectedDay(format(date, 'yyyy-MM-dd'))
                        }}
                    />
                </View>

                <TouchableOpacity onPress={() => setSelectedDate(prev => addDays(prev, 7))}>
                    <ChevronRight color={colors.primary} size={24} style={{ marginHorizontal: 12 }} />
                </TouchableOpacity>
            </View>
            <WeekDaySelector
                selectedDay={selectedDay}
                onSelectDay={(day) => {
                    setSelectedDay(day)
                    setSelectedDate(new Date(day))
                }}
                startDate={weekInterval.startDate}
            />


            {isAdmin && (
                <CollaboratorPicker
                    selectedId={selectedCollaboratorId}
                    onSelect={setSelectedCollaboratorId}
                    collaborators={coaches}
                />
            )}


            <ScheduleComponent trainings={trainings} colors={colors} coaches={coaches as any} />

            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: 24,
                    right: 24,
                    backgroundColor: colors.primary,
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    zIndex: 10,
                }}
                onPress={() => {
                    navigation.navigate('ScheduleCreate');
                }}
            >
                <Plus color="#fff" size={28} />
            </TouchableOpacity>
        </View>
    )
}


