import { useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TextInput, Button } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigation, useRoute } from '@react-navigation/native'
// import { serverFetcher } from '../services/fetcher'
// import { useSWR } from '../lib/swr'
import { showMessage } from 'react-native-flash-message'
import { useTheme } from '../../context/theme-context'
import ThemedInput from '../ui/themedInput'

const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    birthday: z.string(),
    height: z.string(),
    weight: z.string(),
})

type Props = {
    athlete?: {
        name: string
        email: string
        birthday: Date
        height: number
        weight: number
    }
}

type FormData = z.infer<typeof schema>

export default function EditAthleteScreen({ athlete }: Props) {
    const { colors } = useTheme()
    const route = useRoute()
    const navigation = useNavigation()
    const { athleteId } = route.params as { athleteId: string }


    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            email: '',
            birthday: '',
            height: '',
            weight: '',
        },
    })

    useEffect(() => {
        if (athlete) {
            reset({
                name: athlete.name,
                email: athlete.email,
                birthday: athlete.birthday.toISOString().split('T')[0],
                height: String(athlete.height),
                weight: String(athlete.weight),
            })
        }
    }, [athlete])

    const { setValue, handleSubmit, reset } = form

    const inputFields = [
        { name: 'name', placeholder: 'Nome' },
        { name: 'email', placeholder: 'Email' },
        { name: 'birthday', placeholder: 'Data de nascimento' },
        { name: 'height', placeholder: 'Altura', keyboardType: 'numeric' },
        { name: 'weight', placeholder: 'Peso', keyboardType: 'numeric' },
    ]



    async function onSubmit(values: FormData) {

        console.log('Dados submetidos:', values)

        showMessage({
            message: 'Sucesso',
            description: 'Simulação de envio. Conecte com backend para persistir!',
            type: 'success',
        })

        navigation.goBack()
    }

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
                            keyboardType={field.keyboardType as any}
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

    )
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
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
        marginTop: 24,
    },
})
