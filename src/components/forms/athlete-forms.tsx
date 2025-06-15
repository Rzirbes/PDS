import { View, Text, StyleSheet, Button, ScrollView } from 'react-native'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from '../../context/theme-context'
import ThemedInput from '../ui/themedInput'

const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    birthday: z.string(),
    height: z.string(),
    weight: z.string(),
})

export type AthleteFormData = z.infer<typeof schema>

type Props = {
    defaultValues?: Partial<AthleteFormData>
    onSubmit: (data: AthleteFormData) => void
    onCancel?: () => void
    submitText?: string
}

export default function AthleteForm({ defaultValues, onSubmit, onCancel, submitText = 'Salvar' }: Props) {
    const { colors } = useTheme()

    const { setValue, handleSubmit } = useForm<AthleteFormData>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues ?? {
            name: '',
            email: '',
            birthday: '',
            height: '',
            weight: '',
        },
    })

    type Field = {
        name: keyof AthleteFormData
        placeholder: string
        keyboardType?: 'default' | 'numeric' | 'email-address'
    }

    const fields: Field[] = [
        { name: 'name', placeholder: 'Nome' },
        { name: 'email', placeholder: 'Email' },
        { name: 'birthday', placeholder: 'Data de nascimento' },
        { name: 'height', placeholder: 'Altura', keyboardType: 'numeric' },
        { name: 'weight', placeholder: 'Peso', keyboardType: 'numeric' },
    ]

    return (
        <ScrollView style={{ padding: 16, backgroundColor: colors.background }}>
            <Text style={[styles.title, { color: colors.text }]}>Informações do Atleta</Text>

            {fields.map(({ name, placeholder, keyboardType }) => (
                <ThemedInput
                    key={name}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    onChangeText={(text) => setValue(name, text)}
                />
            ))}

            <View style={styles.buttonGroup}>
                {onCancel && <Button title="Cancelar" onPress={onCancel} color={colors.danger} />}
                <Button title={submitText} onPress={handleSubmit(onSubmit)} color={colors.primary} />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
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
})
