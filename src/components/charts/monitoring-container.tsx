import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from 'date-fns';
import { WeekLoadChart } from './week-load-chart';
import { DailyLoadChart } from './daily-load-chart';
import { DailyDurationChart } from './daily-duration-chart';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { useWeekMonitoring } from '../../hooks/use-week-monitoring';
import { useMonotonyMonitoring } from '../../hooks/use-monotony-monitoring';

interface Props {
    athleteId: string;
}

export default function MonitoringContainer({ athleteId }: Props) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });

    const { data: weekMonitoring, isLoading: isLoadingWeek } = useWeekMonitoring({
        athleteUuid: athleteId,
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd'),
    });

    const { data: monotonyMonitoring, isLoading: isLoadingMonotony } = useMonotonyMonitoring({
        athleteUuid: athleteId,
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd'),
    });

    const formattedRange = `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`;

    function goToPreviousWeek() {
        setCurrentDate((prev) => subWeeks(prev, 1));
    }

    function goToNextWeek() {
        setCurrentDate((prev) => addWeeks(prev, 1));
    }

    if (isLoadingWeek || isLoadingMonotony || !weekMonitoring || !monotonyMonitoring) {
        return <Text>Carregando...</Text>;
    }

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
            <View style={styles.selectorRow}>
                <TouchableOpacity onPress={goToPreviousWeek} style={styles.iconButton}>
                    <Ionicons name="chevron-back" size={20} color="#fff" />
                </TouchableOpacity>

                <View style={styles.weekBox}>
                    <Text style={styles.weekText}>{formattedRange}</Text>
                </View>

                <TouchableOpacity onPress={goToNextWeek} style={styles.iconButton}>
                    <Ionicons name="chevron-forward" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <WeekLoadChart data={monotonyMonitoring} />
            {/* <DailyLoadChart data={weekMonitoring} /> */}
            {/* <DailyDurationChart data={weekMonitoring} /> */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    selectorRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 16,
        gap: 12,
    },
    iconButton: {
        backgroundColor: '#2d2d2d',
        borderRadius: 100,
        padding: 8,
        borderWidth: 1,
        borderColor: '#3f3f46',
    },
    weekBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1f2937',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 0.2,
        borderColor: '#facc15',
    },
    weekText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 14,
        paddingHorizontal: 10,
    },
});
