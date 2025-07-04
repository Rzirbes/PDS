// components/ui/injury-card.tsx

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { InjuryContext, BodySide } from '../../types/enums';
import { useTheme } from '../../context/theme-context';

interface InjuryCardProps {
    data: {
        type: string;
        bodyRegion: string;
        bodySide: BodySide;
        occurredDuring: InjuryContext;
        description?: string;
        degree: string;
    };
    onDelete: () => void;
}

export function InjuryCard({ data, onDelete }: InjuryCardProps) {
    const { colors } = useTheme();

    return (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>{data.type}</Text>
            <Text style={{ color: colors.text }}>Região: {data.bodyRegion}</Text>
            <Text style={{ color: colors.text }}>Lado: {data.bodySide}</Text>
            <Text style={{ color: colors.text }}>Contexto: {data.occurredDuring}</Text>
            <Text style={{ color: colors.text }}>Grau: {data.degree}</Text>
            {data.description && <Text style={{ color: colors.text }}>Descrição: {data.description}</Text>}

            <View style={{ marginTop: 8 }}>
                <Button title="Remover" onPress={onDelete} color={colors.danger} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
});
