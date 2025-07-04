// components/pain/pain-card.tsx

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { BodySideLabel, InjuryContextLabel } from '../../enums/injury';
import { useTheme } from '../../context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { PainFormValues } from '../pain/pain-form';

interface Props {
    data: PainFormValues;
    onDelete: () => void;
}

export function PainCard({ data, onDelete }: Props) {
    const { colors } = useTheme();

    return (
        <View style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            padding: 12,
            marginBottom: 10,
            backgroundColor: colors.surface,
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontWeight: 'bold', color: colors.text }}>
                    Lado: {data.bodyRegion} ({BodySideLabel[data.bodySide]})
                </Text>
                <TouchableOpacity onPress={onDelete}>
                    <Ionicons name="trash-outline" size={20} color={colors.danger} />
                </TouchableOpacity>
            </View>
            <Text style={{ color: colors.text }}>
                Ocorreu durante: {data.occurredDuring}
            </Text>
            <Text style={{ color: colors.text }}>
                Intensidade: {data.intensity}/10
            </Text>
            <Text style={{ color: colors.text }}>
                Situação: {InjuryContextLabel[data.occurredDuring]}
            </Text>
            <Text style={{ color: colors.text }}>
                Data: {format(data.date, 'dd/MM/yyyy')}
            </Text>
            {data.description ? (
                <Text style={{ color: colors.text, marginTop: 4 }}>
                    {data.description}
                </Text>
            ) : null}
        </View>
    );
}
