import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Switch, TouchableOpacity } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { useTheme } from '../../context/theme-context';
import ThemedInput from '../ui/themedInput';
import { FormSection } from '../ui/form-section';
import { RootStackParamList } from '../../navigation/types';
import { useAthleteById } from '../../hooks/use-athlete';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Trash } from 'lucide-react-native';
import MultiSelect from '../ui/multi-select';
import { DominantFoot, dominantFootLabel, FootballPosition, footballPositionLabels } from '../../enums/athelte';
import SingleSelect from '../ui/single-select';
import { useCitiesByState, useStatesByCountry } from '../../hooks/use-countries';
import LocationSelect from '../ui/location-select';
import { AddClubModal } from '../ui/add-club-modal';

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


interface Location {
    countryId: string | null;
    stateId: string | null;
    cityId: string | null;
}
export type FormData = z.infer<typeof schema>;

type AthleteFormsProps = {
    defaultValues: FormData;
    onSubmit: (data: FormData) => void;
    newClubs: any[];
    setNewClubs: React.Dispatch<React.SetStateAction<any[]>>;
    mode: 'edit' | 'create';
    isLoading: boolean;
    location: Location;
    setLocation: React.Dispatch<React.SetStateAction<Location>>;
};

export default function AthleteForms({
    defaultValues,
    newClubs,
    setNewClubs,
    mode,
    location,
    setLocation,
}: AthleteFormsProps) {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RootStackParamList, 'EditAthlete'>>();
    const athleteId = route.params?.athleteId;



    const [selectedClubCountryId, setSelectedClubCountryId] = useState<string | undefined>(undefined);
    const [selectedClubStateId, setSelectedClubStateId] = useState<string | undefined>(undefined);
    const [selectedClubCityId, setSelectedClubCityId] = useState<string | undefined>(undefined);

    const [isClubModalVisible, setIsClubModalVisible] = useState(false);

    const { data: clubCities } = useCitiesByState(selectedClubStateId);

    const { data: clubStates } = useStatesByCountry(selectedClubCountryId);


    const { athlete, isLoading, updateAthlete: updateAthleteCache, updateStatus } = useAthleteById(athleteId);


    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            email: '',
            cpf: '',
            phone: '',
            birthday: '',
            height: '',
            weight: '',
            isEnabled: false,
            isMonitorDaily: false,
            bestSkill: '',
            worstSkill: '',
            goal: '',
            dominantFoot: '',
            positions: [],
            description: '',
            country: '',
            state: '',
            city: '',
            zipCode: '',
            street: '',
            number: '',
            neighborhood: '',
            complement: '',
        },
    });

    const { reset, handleSubmit } = form;

    useEffect(() => {
        if (athlete) {
            reset({
                name: athlete.name,
                email: athlete.email ?? '',
                cpf: athlete.cpf ?? '',
                phone: athlete.phone ?? '',
                birthday: athlete.birthday ? new Date(athlete.birthday).toISOString().split('T')[0] : '',
                height: athlete.height !== undefined ? String(athlete.height) : '',
                weight: athlete.weight !== undefined ? String(athlete.weight) : '',
                isEnabled: athlete.isEnabled ?? false,
                isMonitorDaily: athlete.isMonitorDaily ?? false,
                bestSkill: athlete.bestSkill ?? '',
                worstSkill: athlete.worstSkill ?? '',
                goal: athlete.goal ?? '',
                dominantFoot: athlete.dominantFoot ?? '',
                positions: athlete.positions ?? [],
                description: athlete.observation ?? '',

                street: athlete.address?.street ?? '',
                neighborhood: athlete.address?.neighborhood ?? '',
                number: athlete.address?.buildingNumber ?? '',
                complement: athlete.address?.complement ?? '',
                zipCode: athlete.address?.zipCode ?? '',
                city: athlete.address?.cityId ?? '',
                state: athlete.address?.stateId ?? '',
                country: athlete.address?.countryId ?? '',


                clubs: athlete.clubs?.map((club) => club.clubId) ?? [],
            });

            setLocation({
                countryId: athlete.address?.countryId ?? null,
                stateId: athlete.address?.stateId ?? null,
                cityId: athlete.address?.cityId ?? null,
            });

            if (athlete.clubs && athlete.clubs.length > 0) {
                const firstClub = athlete.clubs[0];
                setSelectedClubCountryId(firstClub.countryId);
                setSelectedClubStateId(firstClub.stateId);
                setSelectedClubCityId(firstClub.cityId);
            }
        }
    }, [athlete, reset]);

    function cleanEmptyStrings(obj: Record<string, any>) {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, v]) =>
                v !== '' && v !== undefined
            )
        );
    }


    useEffect(() => {
        const firstClub = athlete?.clubs?.[0];
        if (firstClub?.stateId && clubStates) {
            const foundState = clubStates.find(s => s.id === firstClub.stateId);
            if (foundState) setSelectedClubStateId(firstClub.stateId);
        }
    }, [athlete, clubStates]);

    useEffect(() => {
        const firstClub = athlete?.clubs?.[0];
        if (firstClub?.cityId && clubCities) {
            const foundCity = clubCities.find(c => c.id === firstClub.cityId);
            if (foundCity) setSelectedClubCityId(firstClub.cityId);
        }
    }, [athlete, clubCities]);

    async function onSubmit(values: FormData) {
        if (!athlete) return;
        const { country, state, city, clubs, birthday, height, weight, ...rest } = values;

        const addressPayload = {
            street: rest.street || undefined,
            neighborhood: rest.neighborhood || undefined,
            buildingNumber: rest.number || undefined,
            complement: rest.complement || undefined,
            zipCode: rest.zipCode || undefined,
            country: country || undefined,
            state: state || undefined,
            city: city || undefined,
        };

        const formattedClubs = [...(athlete.clubs ?? []), ...newClubs].map(club => ({
            clubId: club.clubId,
            startDate: club.startDate,
            countryId: club.countryId,
            stateId: club.stateId,
            cityId: club.cityId,
        }));
        const preCleanedPayload = {
            ...rest,
            birthday: birthday ? new Date(birthday) : undefined,
            height: height ? parseFloat(height) : undefined,
            weight: weight ? parseFloat(weight) : undefined,
            bestSkill: rest.bestSkill || undefined,
            worstSkill: rest.worstSkill || undefined,
            goal: rest.goal || undefined,
            dominantFoot: rest.dominantFoot || undefined,
            observation: rest.description || undefined,
            phone: rest.phone || undefined,
            cpf: rest.cpf || undefined,
            address: addressPayload,
            clubs: formattedClubs,

            isEnabled: values.isEnabled ?? false,
            isMonitorDaily: values.isMonitorDaily ?? false,
        };
        const payloadToSend = cleanEmptyStrings(preCleanedPayload);
        try {
            console.log('Payload final:', payloadToSend);
            await updateAthleteCache(payloadToSend, athleteId);
            showMessage({ message: 'Sucesso', description: 'Atleta atualizado com sucesso!', type: 'success' });
            navigation.goBack();
        } catch {
            showMessage({ message: 'Erro', description: 'Falha ao atualizar atleta.', type: 'danger' });
        }
    }
    function removeNewClub(indexToRemove: number) {
        setNewClubs(prev => prev.filter((_, i) => i !== indexToRemove));
    }

    function renderInputs(fields: string[]) {
        return fields.map((fieldName) => {
            const field = inputFields.find(f => f.name === fieldName);
            if (!field) return null;

            return (
                <View key={field.name} style={{ marginBottom: 12 }}>
                    <Text style={{ color: colors.text, marginBottom: 4 }}>{field.label}</Text>
                    <Controller
                        control={form.control}
                        name={field.name as keyof FormData}
                        render={({ field: { onChange, value } }) => (
                            <ThemedInput
                                placeholder={field.placeholder}
                                onChangeText={onChange}
                                value={typeof value === 'string' ? value : ''}
                            />
                        )}
                    />
                </View>
            );
        });
    }

    const inputFields = [
        { name: 'name', label: 'Nome', placeholder: 'Nome', },
        { name: 'email', label: 'Email', placeholder: 'Email', },
        { name: 'cpf', label: 'CPF', placeholder: 'CPF', },
        { name: 'phone', label: 'Telefone', placeholder: 'Telefone', },
        { name: 'birthday', label: 'Data de nascimento', placeholder: 'AAAA-MM-DD', },
        { name: 'height', label: 'Altura (em metros)', placeholder: 'Ex: 1.75', },
        { name: 'weight', label: 'Peso (kg)', placeholder: 'Ex: 70', },
        { name: 'bestSkill', label: 'Melhor Qualidade', placeholder: 'Ex: Visão de jogo', },
        { name: 'worstSkill', label: 'Maior Defeito', placeholder: 'Ex: Finalização', },
        { name: 'goal', label: 'Objetivo', placeholder: 'Ex: Melhorar força', },
        { name: 'description', label: 'Observações', placeholder: 'Observações sobre o atleta', },
        { name: 'zipCode', label: 'CEP', placeholder: 'Ex: 00000-000', },
        { name: 'street', label: 'Rua', placeholder: 'Ex: Rua das Flores', },
        { name: 'number', label: 'Número', placeholder: 'Ex: 123', },
        { name: 'neighborhood', label: 'Bairro', placeholder: 'Ex: Centro', },
        { name: 'complement', label: 'Complemento', placeholder: 'Ex: Apt 101', },
        { name: 'country', label: 'País', placeholder: 'Selecione o país', },
        { name: 'state', label: 'Estado', placeholder: 'Selecione o estado', },
        { name: 'city', label: 'Cidade', placeholder: 'Selecione a cidade', },
    ];


    if (isLoading || !athlete) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <Text style={{ color: colors.text }}>Carregando atleta...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ChevronLeft color={colors.primary} size={24} />
            </TouchableOpacity>
            <ScrollView style={styles.container}>

                <Text style={[styles.title, { color: colors.text }]}>Editar atleta</Text>

                <FormSection title="Dados Pessoais">
                    {renderInputs(['name', 'email', 'cpf', 'phone', 'birthday'])}
                </FormSection>

                <FormSection title="Status">
                    <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: colors.text, marginBottom: 4 }}>Ativo no sistema</Text>
                        <Controller
                            control={form.control}
                            name="isEnabled"
                            render={({ field: { value } }) => (
                                <Switch
                                    value={!!value}
                                    onValueChange={async () => {
                                        await updateStatus();
                                    }}
                                />
                            )}
                        />
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: colors.text, marginBottom: 4 }}>Monitorado diariamente</Text>
                        <Controller
                            control={form.control}
                            name="isMonitorDaily"
                            render={({ field: { onChange, value } }) => (
                                <Switch value={!!value} onValueChange={onChange} />
                            )}
                        />
                    </View>
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
                                options={Object.values(DominantFoot).map((foot) => ({
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
                                options={Object.values(FootballPosition).map((position) => ({
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

                <FormSection
                    title={
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold' }}>Clubes do Atleta</Text>
                            <TouchableOpacity
                                onPress={() => setIsClubModalVisible(true)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 4,
                                    paddingHorizontal: 8,
                                    paddingVertical: 4,
                                }}
                            >
                                <Text style={{ color: colors.primary, fontSize: 16, fontWeight: 'bold' }}>+</Text>
                                <Text style={{ color: colors.primary, fontSize: 14 }}>Adicionar clube</Text>
                            </TouchableOpacity>
                        </View>
                    }
                >
                    {[...(athlete.clubs ?? []), ...newClubs].length > 0 ? (
                        [...(athlete.clubs ?? []), ...newClubs].map((club, index) => {
                            const isNew = index >= (athlete.clubs?.length ?? 0);
                            return (
                                <View
                                    key={`${club.clubId ?? club.name}-${index}`}
                                    style={{
                                        marginBottom: 12,
                                        padding: 12,
                                        borderRadius: 8,
                                        backgroundColor: colors.background,
                                        borderColor: colors.secondary,
                                        borderWidth: 2,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <View>
                                        <Text style={{ color: colors.text, fontWeight: 'bold' }}>{club.name}</Text>
                                        {club.startDate && (
                                            <Text style={{ color: colors.text }}>
                                                Início: {new Date(club.startDate).toLocaleDateString()}
                                            </Text>
                                        )}
                                    </View>

                                    {isNew && (
                                        <TouchableOpacity
                                            onPress={() => removeNewClub(index - (athlete.clubs?.length ?? 0))}
                                            style={{
                                                marginLeft: 8,
                                                backgroundColor: colors.danger,
                                                borderRadius: 8,
                                                padding: 6,
                                            }}
                                        >
                                            <Trash color='#fff' size={20} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            );
                        })
                    ) : (
                        <Text style={{ color: colors.text }}>Nenhum clube cadastrado.</Text>
                    )}
                </FormSection>

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


                <FormSection title="Lesões">
                    {athlete.injuries && athlete.injuries.length > 0 ? (
                        athlete.injuries.map((injury) => (
                            <View
                                key={injury.uuid}
                                style={{
                                    marginBottom: 12,
                                    padding: 12,
                                    borderRadius: 8,
                                    backgroundColor: colors.background,
                                    borderColor: colors.secondary,
                                    borderWidth: 2
                                }}
                            >
                                <Text style={{ color: colors.text, fontWeight: 'bold' }}>{injury.description}</Text>
                                <Text style={{ color: colors.text }}>Região: {injury.bodyRegion}</Text>
                                <Text style={{ color: colors.text }}>Grau: {injury.degree}</Text>
                                <Text style={{ color: colors.text }}>Data: {new Date(injury.date).toLocaleDateString()}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={{ color: colors.text }}>Nenhuma lesão cadastrada.</Text>
                    )}
                </FormSection>

                <FormSection title="Dores">
                    {athlete.pains && athlete.pains.length > 0 ? (
                        athlete.pains.map((pain) => (
                            <View
                                key={pain.uuid}
                                style={{
                                    marginBottom: 12,
                                    padding: 12,
                                    borderRadius: 8,
                                    backgroundColor: colors.background,
                                    borderColor: colors.secondary,
                                    borderWidth: 2
                                }}
                            >
                                <Text style={{ color: colors.text, fontWeight: 'bold' }}>Região: {pain.bodyRegion}</Text>
                                <Text style={{ color: colors.text }}>Intensidade: {pain.intensity}</Text>
                                <Text style={{ color: colors.text }}>Data: {new Date(pain.date).toLocaleDateString()}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={{ color: colors.text }}>Nenhuma dor cadastrada.</Text>
                    )}
                </FormSection>

                <View style={styles.buttonGroup}>
                    <Button title="Cancelar" onPress={() => navigation.goBack()} color={colors.danger} />
                    <Button title="Salvar" onPress={handleSubmit(onSubmit)} color={colors.primary} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
        marginTop: 24,
    },
    backButton: {
        marginTop: 12,
        marginLeft: 16,
    },
});


