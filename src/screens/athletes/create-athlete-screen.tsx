// src/screens/CreateAthleteScreen.tsx

import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Switch, TouchableOpacity } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { useTheme } from '../../context/theme-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Trash } from 'lucide-react-native';
import { DominantFoot, dominantFootLabel, FootballPosition, footballPositionLabels } from '../../enums/athelte';
import { useCitiesByState, useStatesByCountry } from '../../hooks/use-countries';
import ThemedInput from '../../components/ui/themedInput';
import { FormSection } from '../../components/ui/form-section';
import SingleSelect from '../../components/ui/single-select';
import MultiSelect from '../../components/ui/multi-select';
import LocationSelect from '../../components/ui/location-select';
import { AddClubModal } from '../../components/ui/add-club-modal';
import { useCreateAthlete } from '../../hooks/use-athlete';
import { maskCpf, maskPhone, maskZipCode, maskDate } from '../../utils/masks';

const maskMap: Record<string, (value: string) => string> = {
    cpf: maskCpf,
    phone: maskPhone,
    zipCode: maskZipCode,
    birthday: maskDate,
};

const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    cpf: z.string().optional(),
    phone: z.string().optional(),
    birthday: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    isEnabled: z.boolean().optional(),
    isMonitorDaily: z.boolean().optional(),
    bestSkill: z.string().optional(),
    worstSkill: z.string().optional(),
    goal: z.string().optional(),
    dominantFoot: z.string().optional(),
    positions: z.array(z.string()).optional(),
    description: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    neighborhood: z.string().optional(),
    complement: z.string().optional(),
    clubs: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;
interface Location { countryId: string | null; stateId: string | null; cityId: string | null }

export default function CreateAthleteScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [location, setLocation] = useState<Location>({ countryId: null, stateId: null, cityId: null });
    const [isClubModalVisible, setIsClubModalVisible] = useState(false);
    const [newClubs, setNewClubs] = useState<any[]>([]);

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '', email: '', cpf: '', phone: '', birthday: '',
            height: '', weight: '', isEnabled: true, isMonitorDaily: false,
            bestSkill: '', worstSkill: '', goal: '', dominantFoot: '',
            positions: [], description: '', zipCode: '', street: '', number: '',
            neighborhood: '', complement: '', country: '', state: '', city: '', clubs: [],
        },
    });

    const { handleSubmit } = form;
    const { createAthlete } = useCreateAthlete();

    function cleanEmptyStrings(obj: Record<string, any>) {
        return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== '' && v !== undefined));
    }

    async function onSubmit(values: FormData) {
        const {
            country,
            state,
            city,
            birthday,
            height,
            weight,
            street,
            number,
            neighborhood,
            complement,
            zipCode,
            description,
            ...rest
        } = values;

        const addressPayload = {
            street: street || undefined,
            neighborhood: neighborhood || undefined,
            buildingNumber: number || undefined,
            complement: complement || undefined,
            zipCode: zipCode || undefined,
            countryId: location.countryId || undefined,
            stateId: location.stateId || undefined,
            cityId: location.cityId || undefined,
        };

        const formattedClubs = newClubs.map(({ clubId, startDate, countryId, stateId, cityId }) => {
            const result: Record<string, string> = { clubId, startDate, cityId };
            if (countryId) result.countryId = countryId;
            if (stateId) result.stateId = stateId;
            return result;
        });

        const payload = cleanEmptyStrings({
            ...rest,
            birthday: birthday ? new Date(birthday).toISOString() : undefined,
            height: height ? parseFloat(height) : undefined,
            weight: weight ? parseFloat(weight) : undefined,
            observation: description || undefined,
            phone: rest.phone || undefined,
            cpf: rest.cpf || undefined,
            address: addressPayload,
            clubs: formattedClubs,
            isEnabled: values.isEnabled ?? false,
            isMonitorDaily: values.isMonitorDaily ?? false,
            injuries: [],
            pains: [],
        });

        try {
            await createAthlete(payload);
            showMessage({ message: 'Sucesso', description: 'Atleta criado com sucesso!', type: 'success' });
            navigation.goBack();
        } catch {
            showMessage({ message: 'Erro', description: 'Falha ao criar atleta.', type: 'danger' });
        }
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

    function renderInputs(fields: string[]) {
        return fields.map(field => {
            const f = inputFields.find(i => i.name === field);
            if (!f) return null;
            return (
                <View key={f.name} style={{ marginBottom: 12 }}>
                    <Text style={{ color: colors.text, marginBottom: 4 }}>{f.label}</Text>
                    <Controller
                        control={form.control}
                        name={f.name as keyof FormData}
                        render={({ field: { onChange, value } }) => {
                            const maskFn = maskMap[f.name];
                            return (
                                <ThemedInput
                                    placeholder={f.placeholder}
                                    onChangeText={(text) => {
                                        onChange(maskFn ? maskFn(text) : text);
                                    }}
                                    value={typeof value === 'string' ? value : ''}
                                />
                            );
                        }}
                    />
                </View>
            );
        });
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ChevronLeft color={colors.primary} size={24} />
            </TouchableOpacity>

            <ScrollView style={styles.container}>
                <Text style={[styles.title, { color: colors.text }]}>Criar novo atleta</Text>

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
                                selectedValue={value}
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

                <FormSection title="Endereço">
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

                    {newClubs.map((club, index) => (
                        <View
                            key={index}
                            style={{
                                marginVertical: 8,
                                padding: 10,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: colors.secondary,
                            }}
                        >
                            <Text style={{ color: colors.text, fontWeight: 'bold' }}>{club.name}</Text>
                            {club.startDate && <Text style={{ color: colors.text }}>Início: {new Date(club.startDate).toLocaleDateString()}</Text>}
                            <TouchableOpacity onPress={() => setNewClubs(prev => prev.filter((_, i) => i !== index))}>
                                <Trash color="#f00" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </FormSection>

                <AddClubModal
                    visible={isClubModalVisible}
                    onClose={() => setIsClubModalVisible(false)}
                    onSave={(newClub) => {
                        const formatted = {
                            clubId: newClub.id,
                            name: newClub.name,
                            startDate: new Date().toISOString(),
                            countryId: newClub.countryId || undefined,
                            stateId: newClub.stateId || undefined,
                            cityId: newClub.cityId || undefined,
                        };


                        if (!formatted.countryId || !formatted.stateId || !formatted.cityId) {
                            showMessage({ message: 'Erro', description: 'Preencha todos os campos de localização do clube.', type: 'warning' });
                            return;
                        }

                        setNewClubs(prev => [...prev, formatted]);
                        setIsClubModalVisible(false);
                    }}
                />

                <View style={styles.buttonGroup}>
                    <Button title="Cancelar" onPress={() => navigation.goBack()} color={colors.danger} />
                    <Button title="Salvar" onPress={handleSubmit(onSubmit)} color={colors.primary} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, flex: 1 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginTop: 24 },
    backButton: { marginTop: 12, marginLeft: 16 },
});
