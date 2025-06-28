import React from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import {
    BarChart,
    LineChart,
    XAxis,
    YAxis,
} from 'react-native-svg-charts'
import { G, Circle } from 'react-native-svg'
import * as shape from 'd3-shape'
import { addWeeks, endOfWeek, format, parse, startOfWeek, subWeeks } from 'date-fns'
import { generateWeeklyIntervalsAround, generateWeeklyIntervalsForMonth } from '../../utils/date-utils'

interface WeekLoadChartProps {
    data: {
        week: string[]
        monotony: number[]
        strain: number[]
        acuteChronicLoadRatio: number[]
        load: {
            planned: number[]
            performed: number[]
        }
    }
    initialDate: Date
}


export function WeekLoadChart({ data, initialDate }: WeekLoadChartProps,) {
    const padding = 8

    const athleteWeeks = data.week.map((weekStr, index) => {
        const [startStr, endStr] = weekStr.split(' - ')
        const startDate = parse(startStr, 'dd/MM/yyyy', new Date())
        const endDate = parse(endStr, 'dd/MM/yyyy', new Date())

        return {
            startDate,
            endDate,
            weekLoad: data.load.planned[index] ?? 0,
            actualLoad: data.load.performed[index] ?? 0,
            strain: data.strain[index] ?? 0,
            chronicAcute: data.acuteChronicLoadRatio[index] ?? 0,
            monotony: data.monotony[index] ?? 0,
        }
    })

    const currentStart = startOfWeek(initialDate, { weekStartsOn: 0 });

    const chartData = athleteWeeks.map((week) => ({
        planned: week.weekLoad,
        actual: week.actualLoad,
        strain: week.strain,
        monotony: week.monotony,
        acuteChronic: week.chronicAcute,
    }))

    const labels = athleteWeeks.map(
        (week) => `${format(week.startDate, 'd/M')} - ${format(week.endDate, 'd/M')}`
    )
    const AnimatedBar = Animated.createAnimatedComponent(BarChart)
    const barData = [
        { data: chartData.map((d) => ({ value: d.planned })), svg: { fill: '#a37e00' } },
        { data: chartData.map((d) => ({ value: d.actual })), svg: { fill: '#facc15' } },
        { data: chartData.map((d) => ({ value: d.strain })), svg: { fill: '#FF8000' } },
    ]

    const rawMax = Math.max(
        ...chartData.map((d) => d.planned),
        ...chartData.map((d) => d.actual),
        ...chartData.map((d) => d.strain),
        ...chartData.map((d) => d.monotony),
        ...chartData.map((d) => d.acuteChronic),
        1000
    )

    const maxValue = Math.ceil(rawMax / 1000) * 1000

    const lineDecorator = (color: string) => ({ x, y, data }: { x: any; y: any; data: number[] }) => (
        <G>
            {data.map((value, index) => (
                <Circle key={index} cx={x(index)} cy={y(value)} r={3} stroke={color} fill="white" />
            ))}
        </G>
    )

    return (
        <View style={{ flex: 1, paddingHorizontal: padding, paddingTop: 16 }}>
            <Text style={styles.title}>Carga da Semana</Text>
            <View style={styles.chartContainer}>
                <YAxis
                    data={[0, maxValue]}
                    contentInset={{ top: 20, bottom: 20 }}
                    svg={{ fill: '#d4d4d8', fontSize: 10 }}
                    numberOfTicks={5}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={{ flex: 1 }}>
                        <BarChart
                            animate
                            animationDuration={400}
                            style={StyleSheet.absoluteFill}
                            data={barData}
                            yAccessor={({ item }: { item: { value: number } }) => item.value}
                            contentInset={{ top: 20, bottom: 1 }}
                            spacingInner={0.3}
                            gridMin={1000}
                            spacingOuter={0.2}
                            yMin={0}
                            yMax={maxValue}
                        >
                        </BarChart>
                        <LineChart
                            style={StyleSheet.absoluteFill}
                            data={chartData.map((d) => ({ value: d.monotony }))}
                            yAccessor={({ item }: { item: { value: number } }) => item.value}
                            svg={{ stroke: '#009EB3', strokeWidth: 2 }}
                            contentInset={{ top: 20, bottom: 2 }}
                            yMin={0}
                            yMax={maxValue}
                            curve={shape.curveMonotoneX}
                        >
                            {lineDecorator('#009EB3')}
                        </LineChart>
                        <LineChart
                            style={StyleSheet.absoluteFill}
                            data={chartData.map((d) => ({ value: d.acuteChronic }))}
                            yAccessor={({ item }: { item: { value: number } }) => item.value}
                            svg={{ stroke: '#dc2626', strokeWidth: 2 }}
                            contentInset={{ top: 20, bottom: 2 }}
                            yMin={0}
                            yMax={maxValue}
                            curve={shape.curveMonotoneX}
                        >
                            {lineDecorator('#dc2626')}
                        </LineChart>
                    </View>
                    <XAxis
                        style={{ marginTop: 10 }}
                        data={chartData}
                        formatLabel={(_: any, index: any) => labels[index]}
                        svg={{ fontSize: 10, fill: '#d4d4d8', originY: 10 }}
                        contentInset={{ left: 32, right: 32 }}
                        numberOfTicks={labels.length}
                    />
                </View>
            </View>
            <View style={styles.legendRow}>
                <LegendItem color="#a37e00" label="Planejada" />
                <LegendItem color="#facc15" label="Realizada" />
                <LegendItem color="#FF8000" label="Tensão" />
                <LegendItem color="#009EB3" label="Monotonia" />
                <LegendItem color="#dc2626" label="Risco Agudo:Crônico" />
            </View>
        </View>
    )
}

function LegendItem({ color, label }: { color: string; label: string }) {
    return (
        <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: color }]} />
            <Text style={styles.legendText}>{label}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white',
        marginBottom: 12,
    },
    chartContainer: {
        minHeight: 200,
        flexDirection: 'row',
        borderRadius: 12,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        overflow: 'hidden',
    },
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 16,
        marginTop: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    legendBox: {
        width: 12,
        height: 12,
        borderRadius: 2,
        marginRight: 4,
    },
    legendText: {
        fontSize: 12,
        color: 'white',
    },
})