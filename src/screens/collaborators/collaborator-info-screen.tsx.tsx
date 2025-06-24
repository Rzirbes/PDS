import React, { useState, useEffect } from 'react';
import { ScrollView, Text, ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormSection } from '../../components/ui/form-section';
import { LabeledInput } from '../../components/ui/labeled-input';
import { useRoute } from '@react-navigation/native';
import { useCoachById } from '../../hooks/use-coach-by-id';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LocationPickerGroup from '../../components/ui/location-picker-group';
import { useTheme } from '../../context/theme-context';
import { mutate } from 'swr';
import { useCitiesByState, useStatesByCountry } from '../../hooks/use-countries';
import { ColorPickerModal } from '../../components/ui/color-picker-modal';

type Props = NativeStackScreenProps<RootStackParamList, 'CollaboratorDetails'>;

export default function CollaboratorInfoScreen() {
    const { colors } = useTheme();
    const route = useRoute<Props['route']>();
    const { coachId } = route.params;
    const { coach, isLoading, isError } = useCoachById(coachId);

    const [countryId, setCountryId] = useState<string | null>(null);
    const [stateId, setStateId] = useState<string | null>(null);
    const [cityId, setCityId] = useState<string | null>(null);
    const [calendarColor, setCalendarColor] = useState<string>('#624f96');

    const { data: states, isLoading: isLoadingStates } = useStatesByCountry(countryId);
    const { data: cities, isLoading: isLoadingCities } = useCitiesByState(stateId);

    const isLocationDataLoading =
        (countryId && isLoadingStates) ||
        (stateId && isLoadingCities);

    useEffect(() => {
        if (coach) {
            setCountryId(coach.address?.countryId ?? null);
            setStateId(coach.address?.stateId ?? null);
            setCityId(coach.address?.cityId ?? null);

            if (coach.schedulerColor) {
                setCalendarColor(coach.schedulerColor);
            }

            if (coach.address?.countryId) {
                mutate(`states-${coach.address.countryId}`);
            }
            if (coach.address?.stateId) {
                mutate(`cities-${coach.address.stateId}`);
            }
        }
    }, [coach]);

    if (isLoading || isLocationDataLoading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </SafeAreaView>
        );
    }

    if (isError || !coach) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: colors.text }}>Erro ao carregar detalhes do colaborador.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>
                    Informações do Colaborador
                </Text>

                <FormSection title="Informações Básicas">
                    <LabeledInput label="Nome do Colaborador" value={coach.name} />
                    <LabeledInput label="E-mail" value={coach.email} />
                    <LabeledInput label="Cargo" value={coach.role} />
                    <LabeledInput label="Celular" value={coach.phone ?? ''} />
                </FormSection>

                <FormSection title="Endereço">
                    <LabeledInput label="CEP" value={coach.address?.zipCode ?? ''} />
                    <LabeledInput label="Rua" value={coach.address?.street ?? ''} />
                    <LabeledInput label="Número" value={coach.address?.buildingNumber ?? ''} />
                    <LabeledInput label="Bairro" value={coach.address?.neighborhood ?? ''} />
                    <LabeledInput label="Complemento" value={coach.address?.complement ?? ''} />

                    <LocationPickerGroup
                        defaultCountryId={countryId ?? undefined}
                        defaultStateId={stateId ?? undefined}
                        defaultCityId={cityId ?? undefined}
                        onLocationChange={(newCountryId, newStateId, newCityId) => {
                            setCountryId(newCountryId);
                            setStateId(newStateId);
                            setCityId(newCityId);
                        }}
                    />
                </FormSection>

                <FormSection title="Configurações">
                    <Text style={{ color: colors.text, marginBottom: 8 }}>Cor do calendário</Text>
                    <View
                        style={{
                            height: 40,
                            borderRadius: 6,
                            justifyContent: 'center',
                            paddingHorizontal: 12,
                            backgroundColor: calendarColor,
                        }}
                    >

                    </View>
                </FormSection>
            </ScrollView>
        </SafeAreaView>
    );
}
