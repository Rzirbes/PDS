// src/screens/CreateAthleteScreen.tsx

import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { useTheme } from '../../context/theme-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Trash } from 'lucide-react-native';
import { useCreateAthlete } from '../../hooks/use-athlete';
import { AthleteForm } from '../../components/athletes/athlete-form';


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




    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ChevronLeft color={colors.primary} size={24} />
            </TouchableOpacity>

            <ScrollView style={styles.container}>
                <Text style={[styles.title, { color: colors.text }]}>Criar novo atleta</Text>

                <AthleteForm
                    form={form}
                    colors={colors}
                    location={location}
                    setLocation={setLocation}
                    newClubs={newClubs}
                    setNewClubs={setNewClubs}
                    onSubmit={handleSubmit(onSubmit)}
                    isClubModalVisible={isClubModalVisible}
                    setIsClubModalVisible={setIsClubModalVisible}
                    title="Cadastrar Atleta"
                    renderClubList={
                        <View style={{ marginTop: 12 }}>
                            {newClubs.map((club, index) => (
                                <Text key={index} style={{ color: colors.text }}>
                                    • {club.name} — {new Date(club.startDate).toLocaleDateString('pt-BR')}
                                </Text>
                            ))}
                        </View>
                    }
                />

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
