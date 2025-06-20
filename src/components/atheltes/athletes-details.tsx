import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { useTheme } from '../../context/theme-context';
import ThemedInput from '../ui/themedInput';

const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    cpf: z.string().optional(),
    phone: z.string().optional(),
    bestSkill: z.string().optional(),
    worstSkill: z.string().optional(),
    goal: z.string().optional(),
    birthday: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type Props = {
    athlete?: {
        id: string;
        name: string;
        email?: string;
        cpf?: string;
        phone?: string;
        bestSkill?: string;
        worstSkill?: string;
        goal?: string;
        birthday?: string;
        height?: number;
        weight?: number;
    };
};

export default function EditAthleteScreen({ athlete }: Props) {
    const { colors } = useTheme();
    const navigation = useNavigation();

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            email: '',
            cpf: '',
            phone: '',
            bestSkill: '',
            worstSkill: '',
            goal: '',
            birthday: '',
            height: '',
            weight: '',
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
                bestSkill: athlete.bestSkill ?? '',
                worstSkill: athlete.worstSkill ?? '',
                goal: athlete.goal ?? '',
                birthday: athlete.birthday
                    ? new Date(athlete.birthday).toISOString().split('T')[0]
                    : '',
                height: athlete.height ? String(athlete.height) : '',
                weight: athlete.weight ? String(athlete.weight) : '',
            });
        }
    }, [athlete]);

    async function onSubmit(values: FormData) {
        console.log('Dados submetidos:', values);
        showMessage({
            message: 'Sucesso',
            description: 'Simulação de envio. Conecte com backend para persistir!',
            type: 'success',
        });
        navigation.goBack();
    }

    const inputFields = [
        { name: 'name', placeholder: 'Nome' },
        { name: 'email', placeholder: 'Email' },
        { name: 'cpf', placeholder: 'CPF' },
        { name: 'phone', placeholder: 'Telefone' },
        { name: 'bestSkill', placeholder: 'Melhor habilidade' },
        { name: 'worstSkill', placeholder: 'Pior habilidade' },
        { name: 'goal', placeholder: 'Objetivo' },
        { name: 'birthday', placeholder: 'Data de nascimento (AAAA-MM-DD)' },
        { name: 'height', placeholder: 'Altura (ex: 1.75)' },
        { name: 'weight', placeholder: 'Peso (ex: 70)' },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>Editar atleta</Text>

            {inputFields.map((field) => (
                <Controller
                    key={field.name}
                    control={form.control}
                    name={field.name as keyof FormData}
                    render={({ field: { onChange, value } }) => (
                        <ThemedInput
                            placeholder={field.placeholder}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
            ))}

            <View style={styles.buttonGroup}>
                <Button title="Cancelar" onPress={() => navigation.goBack()} color={colors.danger} />
                <Button title="Salvar" onPress={handleSubmit(onSubmit)} color={colors.primary} />
            </View>
        </ScrollView>
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
});
