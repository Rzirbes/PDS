import { ScrollView, View, Text, StyleSheet, Button } from 'react-native';
import { useTheme } from '../../context/theme-context';
import { FormSection } from '../ui/form-section';
import { format, parseISO } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type Injury = {
    id: string;
    date: string;
    bodyRegion: string;
    side: string;
    degree: string;
    occurredDuring: string;
    diagnosis: string;
    surgery: string;
    description: string;
};

type Pain = {
    id: string;
    date: string;
    bodyRegion: string;
    side: string;
    intensity: number;
    occurredDuring: string;
    description: string;
};

type Props = {
    athlete?: {
        id: string;
        name: string;
        email?: string;
        cpf?: string;
        phone?: string;
        birthday?: string;
        height?: number;
        weight?: number;
        isEnabled?: boolean;
        isMonitorDaily?: boolean;
        dominantFoot?: string;
        positions?: string[];
        injuries?: Injury[];
        pains?: Pain[];
    };
};

export default function AthleteInfoScreen({ athlete }: Props) {
    const { colors } = useTheme();

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    function handleEdit() {
        if (!athlete) return;
        navigation.navigate('EditAthlete', { athleteId: athlete.id });
    }

    if (!athlete) return null;

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Informações Pessoais */}
            <View style={[styles.sectionCard, { borderColor: colors.muted }]}>
                <FormSection title="Informações Pessoais">
                    <InfoItem label="Nome" value={athlete.name} />
                    <InfoItem label="Email" value={athlete.email} />
                    <InfoItem label="CPF" value={athlete.cpf} />
                    <InfoItem label="Celular" value={athlete.phone} />
                    <InfoItem label="Data de nascimento" value={formatDate(athlete.birthday)} />
                    <InfoItem label="Ativo no sistema" value={athlete.isEnabled ? 'Sim' : 'Não'} />
                    <InfoItem label="Monitorado diariamente" value={athlete.isMonitorDaily ? 'Sim' : 'Não'} />
                </FormSection>
            </View>

            {/* Detalhes Técnicos e Físicos */}
            <View style={[styles.sectionCard, { borderColor: colors.muted }]}>
                <FormSection title="Detalhes Técnicos e Físicos">
                    <InfoItem label="Altura" value={athlete.height ? `${athlete.height} m` : '-'} />
                    <InfoItem label="Peso" value={athlete.weight ? `${athlete.weight} kg` : '-'} />
                    <InfoItem label="Pé dominante" value={athlete.dominantFoot} />
                    <InfoItem label="Posições" value={athlete.positions?.join(', ')} />
                </FormSection>
            </View>

            {/* Lesões */}
            <View style={[styles.sectionCard, { borderColor: colors.muted }]}>
                <FormSection title="Lesões">
                    {athlete.injuries && athlete.injuries.length > 0 ? (
                        athlete.injuries.map((injury) => (
                            <View key={injury.id} style={[styles.subCard, { borderColor: colors.primary }]}>
                                {renderObjectAsInfoItems(injury, injuryFields)}
                            </View>
                        ))
                    ) : (
                        <Text style={[styles.emptyText, { color: colors.text }]}>Nenhuma lesão registrada.</Text>
                    )}
                </FormSection>
            </View>

            {/* Dores Musculares */}
            <View style={[styles.sectionCard, { borderColor: colors.muted }]}>
                <FormSection title="Dores Musculares">
                    {athlete.pains && athlete.pains.length > 0 ? (
                        athlete.pains.map((pain) => (
                            <View key={pain.id} style={[styles.subCard, { borderColor: colors.primary }]}>
                                {renderObjectAsInfoItems(pain, painFields)}
                            </View>
                        ))
                    ) : (
                        <Text style={[styles.emptyText, { color: colors.text }]}>Nenhuma dor registrada.</Text>
                    )}
                </FormSection>
            </View>
            <View style={{ marginTop: 20 }}>
                <Button title="Editar informações" onPress={handleEdit} color={colors.primary} />
            </View>
        </ScrollView>
    );
}

function InfoItem({ label, value }: { label: string; value?: string }) {
    const { colors } = useTheme();
    return (
        <View style={{ marginBottom: 8 }}>
            <Text style={{ color: colors.text, opacity: 0.6, fontSize: 13 }}>{label}:</Text>
            <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }}>{value || '-'}</Text>
        </View>
    );
}

function formatDate(isoDate?: string) {
    if (!isoDate) return '-';
    try {
        return format(parseISO(isoDate), 'dd/MM/yyyy');
    } catch {
        return '-';
    }
}

function renderObjectAsInfoItems(
    obj: Record<string, any>,
    fields: { key: string; label: string; isDate?: boolean }[]
) {
    return fields.map(({ key, label, isDate }) => {
        let value = obj[key];
        if (isDate && value) value = formatDate(value);
        if (value === undefined || value === null) value = '-';
        return <InfoItem key={key} label={label} value={String(value)} />;
    });
}

const injuryFields = [
    { key: 'date', label: 'Data', isDate: true },
    { key: 'bodyRegion', label: 'Região' },
    { key: 'side', label: 'Lado' },
    { key: 'degree', label: 'Grau' },
    { key: 'occurredDuring', label: 'Ocorrida durante' },
    { key: 'diagnosis', label: 'Diagnóstico' },
    { key: 'surgery', label: 'Cirurgia' },
    { key: 'description', label: 'Descrição' },
];

const painFields = [
    { key: 'date', label: 'Data', isDate: true },
    { key: 'bodyRegion', label: 'Região' },
    { key: 'side', label: 'Lado' },
    { key: 'intensity', label: 'Intensidade' },
    { key: 'occurredDuring', label: 'Ocorrida durante' },
    { key: 'description', label: 'Descrição' },
];

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
    sectionCard: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        elevation: 2,
    },
    subCard: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        backgroundColor: '#1e1e1e',
        elevation: 1,
    },
    emptyText: {
        opacity: 0.7,
        fontStyle: 'italic',
    },
});
