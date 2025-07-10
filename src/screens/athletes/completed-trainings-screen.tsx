import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, SectionList } from 'react-native';
import { format, addDays } from 'date-fns';
import { useUser } from '../schedule/schedule-screen';
import { useFilteredSchedules } from '../../hooks/use-filtered-schedules';
import { DatePickerInput } from '../../components/ui/date-picker-input';
import { useTheme } from '../../context/theme-context';
import { ptBR } from 'date-fns/locale';
import TrainingSectionList from '../../components/ui/training-section-list';

type Props = {
    athleteId?: string | number;
};
export default function WeeklyTrainingsScreen({ athleteId }: Props) {
    const { user } = useUser();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { colors } = useTheme()
    const { trainings, isLoading, weekInterval } = useFilteredSchedules({
        selectedDate,
        selectedDay: '',
        selectedCollaboratorId: null,
        user,
    });

    const filteredTrainings = trainings.filter((t: any) => {
        const isFinalized = t.isCompleted;
        const matchesAthlete = athleteId ? t.athleteId === athleteId : true;
        return isFinalized && matchesAthlete;
    });

    const trainingsByDay: Record<string, any[]> = {};
    filteredTrainings.forEach((training: any) => {
        const date = format(training.date, 'EEEE (dd/MM)', { locale: ptBR });
        if (!trainingsByDay[date]) {
            trainingsByDay[date] = [];
        }
        trainingsByDay[date].push(training);
    });

    const sections = Object.keys(trainingsByDay).map((day) => ({
        title: day,
        data: trainingsByDay[day],
    }));

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: 'white' }}>
                Treinos da Semana
            </Text>

            <DatePickerInput
                label="Selecionar data"
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
            />

            <Text style={{ marginVertical: 8, fontSize: 16, fontWeight: '600', color: 'white' }}>
                Semana: {format(weekInterval.startDate, 'dd/MM/yyyy')} até {format(weekInterval.endDate, 'dd/MM/yyyy')}
            </Text>

            {isLoading ? (
                <ActivityIndicator size="large" />
            ) : (
                <TrainingSectionList sections={sections} />
            )}
        </View>
    );
}
