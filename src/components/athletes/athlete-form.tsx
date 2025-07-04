import { View, Text, Button, Switch, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { DominantFoot, dominantFootLabel, FootballPosition, footballPositionLabels } from '../../enums/athelte';
import ThemedInput from '../ui/themedInput';
import SingleSelect from '../ui/single-select';
import MultiSelect from '../ui/multi-select';
import LocationSelect from '../ui/location-select';
import { AddClubModal } from '../ui/add-club-modal';
import { Trash } from 'lucide-react-native';
import { FormSection } from '../ui/form-section';

interface AthleteFormProps {
    form: UseFormReturn<any>;
    colors: any;
    location: {
        countryId: string | null;
        stateId: string | null;
        cityId: string | null;
    };
    setLocation: (loc: any) => void;
    newClubs: any[];
    setNewClubs: React.Dispatch<React.SetStateAction<any[]>>;
    onSubmit: () => void;
    isClubModalVisible: boolean;
    setIsClubModalVisible: (value: boolean) => void;
    title: string;
    isEdit?: boolean;
    renderClubList?: React.ReactNode;
    renderExtraSections?: React.ReactNode;
}

const inputFields = [
    { name: 'name', label: 'Nome', placeholder: 'Nome' },
    { name: 'email', label: 'Email', placeholder: 'Email' },
    { name: 'cpf', label: 'CPF', placeholder: 'CPF' },
    { name: 'phone', label: 'Telefone', placeholder: 'Telefone' },
    { name: 'birthday', label: 'Data de nascimento', placeholder: 'AAAA-MM-DD' },
    { name: 'height', label: 'Altura (m)', placeholder: 'Ex: 1.75' },
    { name: 'weight', label: 'Peso (kg)', placeholder: 'Ex: 70' },
    { name: 'bestSkill', label: 'Melhor Qualidade', placeholder: 'Ex: Visão de jogo' },
    { name: 'worstSkill', label: 'Maior Defeito', placeholder: 'Ex: Finalização' },
    { name: 'goal', label: 'Objetivo', placeholder: 'Ex: Ganhar força' },
    { name: 'description', label: 'Observações', placeholder: 'Observações' },
    { name: 'zipCode', label: 'CEP', placeholder: '00000-000' },
    { name: 'street', label: 'Rua', placeholder: 'Rua das Flores' },
    { name: 'number', label: 'Número', placeholder: '123' },
    { name: 'neighborhood', label: 'Bairro', placeholder: 'Centro' },
    { name: 'complement', label: 'Complemento', placeholder: 'Apt 101' },
];

export function AthleteForm({
    form,
    colors,
    location,
    setLocation,
    newClubs,
    setNewClubs,
    onSubmit,
    isClubModalVisible,
    setIsClubModalVisible,
    title,
    isEdit = false,
    renderClubList,
    renderExtraSections
}: AthleteFormProps) {
    const renderInputs = (fields: string[]) => {
        return fields.map((field) => {
            const f = inputFields.find(i => i.name === field);
            if (!f) return null;
            return (
                <View key={f.name} style={{ marginBottom: 12 }}>
                    <Text style={{ color: colors.text, marginBottom: 4 }}>{f.label}</Text>
                    <Controller
                        control={form.control}
                        name={f.name as any}
                        render={({ field: { onChange, value } }) => (
                            <ThemedInput
                                placeholder={f.placeholder}
                                onChangeText={onChange}
                                value={typeof value === 'string' ? value : ''}
                            />
                        )}
                    />
                </View>
            );
        });
    };

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

            <FormSection title="Dados Pessoais">
                {renderInputs(['name', 'email', 'cpf', 'phone', 'birthday'])}
            </FormSection>

            <FormSection title="Status">
                <Controller
                    control={form.control}
                    name="isEnabled"
                    render={({ field: { value, onChange } }) => (
                        <View style={{ marginBottom: 12 }}>
                            <Text style={{ color: colors.text, marginBottom: 4 }}>Ativo no sistema</Text>
                            <Switch value={!!value} onValueChange={onChange} />
                        </View>
                    )}
                />
                <Controller
                    control={form.control}
                    name="isMonitorDaily"
                    render={({ field: { value, onChange } }) => (
                        <View style={{ marginBottom: 12 }}>
                            <Text style={{ color: colors.text, marginBottom: 4 }}>Monitorado diariamente</Text>
                            <Switch value={!!value} onValueChange={onChange} />
                        </View>
                    )}
                />
            </FormSection>

            <FormSection title="Características">
                {renderInputs(['height', 'weight', 'bestSkill', 'worstSkill', 'goal', 'description'])}
                <Controller
                    control={form.control}
                    name="dominantFoot"
                    render={({ field: { value, onChange } }) => (
                        <SingleSelect
                            label="Pé dominante"
                            selectedValue={value ?? ''}
                            onChange={onChange}
                            options={Object.values(DominantFoot).map(foot => ({
                                value: foot,
                                label: dominantFootLabel[foot],
                            }))}
                        />
                    )}
                />
                <Controller
                    control={form.control}
                    name="positions"
                    render={({ field: { value, onChange } }) => (
                        <MultiSelect
                            label="Posições em campo"
                            selectedValues={value ?? []}
                            onChange={onChange}
                            options={Object.values(FootballPosition).map(position => ({
                                label: footballPositionLabels[position],
                                value: position,
                            }))}
                        />
                    )}
                />
            </FormSection>

            <FormSection title="Endereço do Atleta">
                <LocationSelect
                    location={location}
                    setLocation={setLocation}
                    control={form.control}
                    watch={form.watch}
                    setValue={form.setValue}
                />
                {renderInputs(['zipCode', 'street', 'number', 'neighborhood', 'complement'])}
            </FormSection>

            <FormSection title="Clubes do Atleta">
                <TouchableOpacity onPress={() => setIsClubModalVisible(true)}>
                    <Text style={{ color: colors.primary, fontSize: 16 }}>+ Adicionar clube</Text>
                </TouchableOpacity>
                {renderClubList}
            </FormSection>

            {renderExtraSections}

            <AddClubModal
                visible={isClubModalVisible}
                onClose={() => setIsClubModalVisible(false)}
                onSave={(newClub) => {
                    const formattedClub = {
                        clubId: newClub.id,
                        name: newClub.name,
                        startDate: new Date().toISOString(),
                        countryId: newClub.countryId,
                        stateId: newClub.stateId,
                        cityId: newClub.cityId,
                    };
                    setNewClubs((prev) => [...prev, formattedClub]);
                    setIsClubModalVisible(false);
                }}
            />

            <View style={styles.buttonGroup}>
                <Button title="Salvar" onPress={onSubmit} color={colors.primary} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, flex: 1 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    buttonGroup: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 24 },
});
