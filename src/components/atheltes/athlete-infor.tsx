import { ScrollView, View, Text, StyleSheet, Button } from 'react-native';
import { useTheme } from '../../context/theme-context';
import { FormSection } from '../ui/form-section';
import { format, parseISO } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Club } from '../../services/club-service';
import { AthleteDetails } from '../../services/athlete-service';
import { BodySideLabel, BooleanLabel, InjuryContextLabel, InjuryDegreeLabel } from '../../enums/injury';

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

export interface Address {
    street?: string;
    neighborhood?: string;
    buildingNumber?: string;
    complement?: string;
    zipCode?: string;
    city?: string;
    state?: string;
    country?: string;
}

type Props = {
    athlete?: AthleteDetails
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

            {/* Endereço do Atleta */}
            <View style={[styles.sectionCard, { borderColor: colors.muted }]}>
                <FormSection title="Endereço do Atleta">
                    {athlete.address ? (
                        <>
                            <InfoItem label="Rua" value={athlete.address.street} />
                            <InfoItem label="Número" value={athlete.address.buildingNumber} />
                            <InfoItem label="Bairro" value={athlete.address.neighborhood} />
                            <InfoItem label="Complemento" value={athlete.address.complement} />
                            <InfoItem label="CEP" value={athlete.address.zipCode} />
                            <InfoItem label="Cidade" value={athlete.address.city} />
                            <InfoItem label="Estado" value={athlete.address.state} />
                            <InfoItem label="País" value={athlete.address.country} />
                        </>
                    ) : (
                        <Text style={[styles.emptyText, { color: colors.text }]}>Nenhum endereço cadastrado.</Text>
                    )}
                </FormSection>
            </View>

            <View style={[styles.sectionCard, { borderColor: colors.muted }]}>
                <FormSection title="Histórico de Clubes">
                    {athlete.clubs && athlete.clubs.length > 0 ? (
                        athlete.clubs.map((club) => (
                            <View key={club.clubId} style={[styles.subCard, { borderColor: colors.primary }]}>
                                <InfoItem label="Nome do clube" value={club.name} />
                                <InfoItem label="Data de entrada" value={formatDate(club.startDate)} />
                            </View>
                        ))
                    ) : (
                        <Text style={[styles.emptyText, { color: colors.text }]}>Nenhum clube registrado.</Text>
                    )}
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

        if (isDate && value) {
            value = formatDate(value);
        } else if (key === 'bodySide' && value) {
            value = BodySideLabel[value] ?? value;
        } else if (key === 'degree' && value) {
            value = InjuryDegreeLabel[value] ?? value;
        } else if (key === 'occurredDuring' && value) {
            value = InjuryContextLabel[value] ?? value;
        } else if ((key === 'diagnosisConfirmed' || key === 'requiresSurgery') && value !== undefined) {
            value = BooleanLabel[String(value) as 'true' | 'false'];
        }

        if (value === undefined || value === null) value = '-';

        return <InfoItem key={key} label={label} value={String(value)} />;
    });
}

const injuryFields = [
    { key: 'date', label: 'Data', isDate: true },
    { key: 'bodyRegion', label: 'Região' },
    { key: 'bodySide', label: 'Lado' },
    { key: 'degree', label: 'Grau' },
    { key: 'occurredDuring', label: 'Ocorrida durante' },
    { key: 'diagnosisConfirmed', label: 'Diagnóstico confirmado' },
    { key: 'requiresSurgery', label: 'Cirurgia necessária' },
    { key: 'description', label: 'Descrição' },
];

const painFields = [
    { key: 'date', label: 'Data', isDate: true },
    { key: 'bodyRegion', label: 'Região' },
    { key: 'bodySide', label: 'Lado' },
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
