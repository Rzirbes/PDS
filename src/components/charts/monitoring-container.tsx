import React, { useState } from 'react'
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from 'date-fns'
import { WeekLoadChart } from './week-load-chart'
import { DailyLoadChart } from './daily-load-chart'
import { DailyDurationChart } from './daily-duration-chart'
import Ionicons from '@expo/vector-icons/build/Ionicons'

export default function MonitoringContainer() {
    const [currentDate, setCurrentDate] = useState(new Date())

    const start = startOfWeek(currentDate, { weekStartsOn: 0 })
    const end = endOfWeek(currentDate, { weekStartsOn: 0 })
    const formattedRange = `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`

    function goToPreviousWeek() {
        setCurrentDate((prev) => subWeeks(prev, 1))
    }

    function goToNextWeek() {
        setCurrentDate((prev) => addWeeks(prev, 1))
    }

    // Aqui você substituiria pelos dados reais conforme a semana
    const weekMonitoringResponse = {
        days: [start, addWeeks(start, 1), addWeeks(start, 2), addWeeks(start, 3), addWeeks(start, 4)],
        PSRs: [205, 2003, 1085, 21, 143],
        durations: {
            planned: [2800, 3000, 0, 3200, 2500],
            performed: [0, 0, 0, 600, 2100],
        },
        trainings: { planned: [], performed: [] },
        PSEs: {
            planned: [100, 100, 2060, 20, 3075],
            performed: [112, 193, 3500, 193, 193],
        },
    }

    const monotonyMonitoringResponse = {
        week: ['2025-W19', '2025-W20', '2025-W21', '2025-W22', '2025-W23'],
        monotony: [21, 2003, 1085, 205, 143],
        strain: [100, 2060, 20, 193, 3075],
        acuteChronicLoadRatio: [112, 193, 2000, 193, 193],
        load: {
            planned: [2800, 3000, 0, 3200, 2500],
            performed: [0, 0, 0, 600, 2100],
        },
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

            <WeekLoadChart data={monotonyMonitoringResponse} />
            <DailyLoadChart data={weekMonitoringResponse} />
            <DailyDurationChart data={weekMonitoringResponse} />
        </ScrollView>
    )
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
        paddingHorizontal: 10
    },
})
