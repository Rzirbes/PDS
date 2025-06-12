// src/components/WeekDaySelector.tsx

import React from 'react'
import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useTheme } from '../../context/ThemeContext'

interface Props {
    selectedDay: string | null
    onSelectDay: (date: string) => void
    startDate: Date
}

export default function WeekDaySelector({ selectedDay, onSelectDay, startDate }: Props) {
    const { colors } = useTheme()

    const screenWidth = Dimensions.get('window').width
    const spacing = 4 
    const totalSpacing = spacing * 6 
    const itemWidth = (screenWidth - 32 - totalSpacing) / 7 

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            {Array.from({ length: 7 }).map((_, index) => {
                const currentDate = new Date(startDate)
                currentDate.setDate(currentDate.getDate() + index)
                const dateKey = format(currentDate, 'yyyy-MM-dd')
                const isSelected = selectedDay === dateKey

                return (
                    <TouchableOpacity
                        key={dateKey}
                        onPress={() => onSelectDay(dateKey)}
                        style={{ width: itemWidth }}
                    >
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 10,
                                backgroundColor: isSelected ? colors.primary : '',
                                borderRadius: 40,
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.text,
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                    opacity: 0.6,
                                }}
                            >
                                {format(currentDate, 'EEEE', { locale: ptBR })
                                    .slice(0, 3)
                                    .normalize('NFD')
                                    .replace(/[\u0300-\u036f]/g, '')
                                    .toUpperCase()}
                            </Text>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                }}
                            >
                                {format(currentDate, 'dd')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}
