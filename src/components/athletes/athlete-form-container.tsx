// AthleteFormContainer.tsx
import { useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAthleteById } from '../../hooks/use-athlete';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView, Text } from 'react-native';
import { useTheme } from '../../context/theme-context';
import AthleteForm, { FormData } from './athlete-form';

export default function AthleteFormContainer() {
    const { athleteId } = useRoute<RouteProp<RootStackParamList, 'EditAthlete'>>().params;
    const navigation = useNavigation();
    const { athlete, isLoading, updateAthlete } = useAthleteById(athleteId);
    const [newClubs, setNewClubs] = useState<any[]>([]);
    const { colors } = useTheme();
    interface Location {
        countryId: string | null;
        stateId: string | null;
        cityId: string | null;
    }
    const [location, setLocation] = useState<Location>({ countryId: null, stateId: null, cityId: null });


    useEffect(() => {
        if (athlete?.address) {
            setLocation({
                countryId: athlete.address.countryId ?? null,
                stateId: athlete.address.stateId ?? null,
                cityId: athlete.address.cityId ?? null,
            });
        }
    }, [athlete]);

    async function handleUpdate(data: FormData) {
        if (!athlete) return;

        const formattedClubs = [...(athlete.clubs ?? []), ...newClubs].map(club => ({
            clubId: club.clubId,
            startDate: club.startDate,
            countryId: club.countryId,
            stateId: club.stateId,
            cityId: club.cityId,
        }));

        const payload = {
            ...data,
            birthday: data.birthday ? new Date(data.birthday) : undefined,
            height: data.height ? parseFloat(data.height) : undefined,
            weight: data.weight ? parseFloat(data.weight) : undefined,
            observation: data.description || undefined,
            address: {
                street: data.street || undefined,
                neighborhood: data.neighborhood || undefined,
                buildingNumber: data.number || undefined,
                complement: data.complement || undefined,
                zipCode: data.zipCode || undefined,
                country: data.country || undefined,
                state: data.state || undefined,
                city: data.city || undefined,
            },
            clubs: formattedClubs,
        };

        try {
            await updateAthlete(payload, athleteId);
            showMessage({ message: 'Atleta atualizado com sucesso!', type: 'success' });
            navigation.goBack();
        } catch (e) {
            showMessage({ message: 'Erro ao atualizar atleta', type: 'danger' });
        }
    }

    if (isLoading || !athlete) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <Text style={{ color: colors.text }}>Carregando atleta...</Text>
            </SafeAreaView>
        );
    }

    const defaultValues: FormData = {
        name: athlete.name,
        email: athlete.email,
        cpf: athlete.cpf ?? '',
        phone: athlete.phone ?? '',
        birthday: athlete.birthday ?? '',
        height: athlete.height?.toString() ?? '',
        weight: athlete.weight?.toString() ?? '',
        isEnabled: athlete.isEnabled,
        isMonitorDaily: athlete.isMonitorDaily,
        bestSkill: athlete.bestSkill ?? '',
        worstSkill: athlete.worstSkill ?? '',
        goal: athlete.goal ?? '',
        description: athlete.observation ?? '',
        dominantFoot: athlete.dominantFoot ?? '',
        positions: athlete.positions ?? [],
        zipCode: athlete.address?.zipCode ?? '',
        street: athlete.address?.street ?? '',
        number: athlete.address?.buildingNumber ?? '',
        neighborhood: athlete.address?.neighborhood ?? '',
        complement: athlete.address?.complement ?? '',
        country: athlete.address?.countryId ?? '',
        state: athlete.address?.stateId ?? '',
        city: athlete.address?.cityId ?? '',
        clubs: athlete.clubs?.map(club => club.clubId) ?? [],
    };

    return (
        <AthleteForm
            defaultValues={defaultValues}
            onSubmit={handleUpdate}
            newClubs={newClubs}
            setNewClubs={setNewClubs}
            mode="edit"
            isLoading={isLoading}
            location={location}
            setLocation={setLocation}
        />
    );
}
