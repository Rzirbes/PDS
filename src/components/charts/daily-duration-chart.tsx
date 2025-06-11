import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import {
    BarChart,
    LineChart,
    XAxis,
    YAxis,
    Grid,
} from 'react-native-svg-charts'
import { G, Circle } from 'react-native-svg'
import * as shape from 'd3-shape'

interface WeekMonitoringResponseDto {
    days: Date[]
    durations: {
        planned: number[]
        performed: number[]
    }
    PSEs: {
        planned: number[]
        performed: number[]
    }
}

interface DurationChartProps {
    data: WeekMonitoringResponseDto
}

export function DailyDurationChart({ data }: DurationChartProps) {
    const labels = data.days.map((d) =>
        new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    )

    const chartData = data.days.map((_, index) => ({
        plannedDuration: data.durations.planned[index] ?? 0,
        actualDuration: data.durations.performed[index] ?? 0,
        plannedPSE: data.PSEs.planned[index] ?? 0,
        actualPSE: data.PSEs.performed[index] ?? 0,
    }))

    const barData = [
        { data: chartData.map((d) => ({ value: d.plannedDuration })), svg: { fill: '#a37e00' } },
        { data: chartData.map((d) => ({ value: d.actualDuration })), svg: { fill: '#facc15' } },
    ]

    const rawMax = Math.max(
        ...chartData.map((d) => d.plannedDuration),
        ...chartData.map((d) => d.actualDuration),
        ...chartData.map((d) => d.plannedPSE),
        ...chartData.map((d) => d.actualPSE),
        1000
    )

    const maxValue = Math.ceil(rawMax / 1000) * 1000

    const lineDecorator = (color: string) => ({ x, y, data }: { x: any; y: any; data: { value: number }[] }) => (
        <G>
            {data.map((item, index) => (
                <Circle key={index} cx={x(index)} cy={y(item.value)} r={3} stroke={color} fill="white" />
            ))}
        </G>
    )

    return (
        <View style={{ flex: 1, paddingHorizontal: 8, paddingTop: 16 }}>
            <Text style={styles.title}>Duração Total - (Minutos) x PSE</Text>
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
                            style={StyleSheet.absoluteFill}
                            data={barData}
                            yAccessor={({ item }: { item: { value: number } }) => item.value}
                            contentInset={{ top: 20, bottom: 0 }}
                            spacingInner={0.3}
                            spacingOuter={0.2}
                            yMin={0}
                            yMax={maxValue}
                        >
                        </BarChart>

                        <LineChart
                            style={StyleSheet.absoluteFill}
                            data={chartData.map((d) => ({ value: d.plannedPSE }))}
                            yAccessor={({ item }: { item: { value: number } }) => item.value}
                            svg={{ stroke: '#009EB2', strokeWidth: 2 }}
                            contentInset={{ top: 20, bottom: 0 }}
                            yMin={0}
                            yMax={maxValue}
                            curve={shape.curveMonotoneX}
                        >
                            {lineDecorator('#009EB2')}
                        </LineChart>

                        <LineChart
                            style={StyleSheet.absoluteFill}
                            data={chartData.map((d) => ({ value: d.actualPSE }))}
                            yAccessor={({ item }: { item: { value: number } }) => item.value}
                            svg={{ stroke: '#dc2626', strokeWidth: 2 }}
                            contentInset={{ top: 20, bottom: 0 }}
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
                <LegendItem color="#a37e00" label="Tempo Planejado" />
                <LegendItem color="#facc15" label="Tempo Realizado" />
                <LegendItem color="#009EB2" label="PSE Planejado" />
                <LegendItem color="#dc2626" label="PSE Realizado" />
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
        // backgroundColor: '#394353',
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