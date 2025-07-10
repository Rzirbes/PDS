import React from 'react';
import { SectionList, Text, View } from 'react-native';
import { useTheme } from '../../context/theme-context';
import { Feather } from '@expo/vector-icons';

type Training = {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    date: Date;
    athleteName: string;
    coachName: string;
    isCompleted: boolean; // Adiciona esse campo aqui
};

type Section = {
    title: string;
    data: Training[];
};

type Props = {
    sections: Section[];
};

export default function TrainingSectionList({ sections }: Props) {
    const { colors } = useTheme();

    return (
        <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderSectionHeader={({ section: { title } }) => (
                <View style={{ backgroundColor: colors.background }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 8, marginBottom: 8, color: colors.text }}>
                        {title.charAt(0).toUpperCase() + title.slice(1)}
                    </Text>
                </View>
            )}
            renderItem={({ item }) => (
                <View
                    style={{
                        backgroundColor: colors.primary,
                        padding: 12,
                        marginBottom: 8,
                        borderRadius: 8,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
                        <Text>{item.startTime} às {item.endTime}</Text>
                        <Text>Atleta: {item.athleteName}</Text>
                        <Text>Treinador: {item.coachName}</Text>
                    </View>
                    {item.isCompleted && (
                        <Feather name="check-circle" size={24} color="white" style={{ marginLeft: 12 }} />
                    )}
                </View>
            )}
            ListEmptyComponent={
                <Text style={{ marginTop: 20, textAlign: 'center', color: 'white' }}>
                    Nenhum treino encontrado para essa semana.
                </Text>
            }
        />
    );
}
