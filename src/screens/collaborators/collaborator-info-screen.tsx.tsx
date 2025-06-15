import React from 'react'
import { ScrollView, Text, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../context/theme-context'
import { FormSection } from '../../components/ui/form-section'
import { LabeledInput } from '../../components/ui/labeled-input'
import { useRoute } from '@react-navigation/native'
import { useCoachById } from '../../hooks/use-coach-by-id'
import { RootStackParamList } from '../../navigation/types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

type Props = NativeStackScreenProps<RootStackParamList, 'CollaboratorDetails'>

export default function CollaboratorInfoScreen() {
    const { colors } = useTheme()
    const route = useRoute<Props['route']>()
    const { coachId } = route.params
    const { coach, isLoading, isError } = useCoachById(coachId)

    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </SafeAreaView>
        )
    }

    if (isError || !coach) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: colors.text }}>Erro ao carregar detalhes do colaborador.</Text>
            </SafeAreaView>
        )
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
                    {[
                        { label: 'CEP', value: coach.address?.cep },
                        { label: 'Rua', value: coach.address?.street },
                        { label: 'Número', value: coach.address?.number },
                        { label: 'Bairro', value: coach.address?.neighborhood },
                        { label: 'Complemento', value: coach.address?.complement },
                        { label: 'País', value: coach.address?.country },
                        { label: 'Estado', value: coach.address?.state },
                        { label: 'Cidade', value: coach.address?.city },
                    ].map((field) => (
                        <LabeledInput key={field.label} label={field.label} value={field.value ?? ''} />
                    ))}
                </FormSection>

                <FormSection title="Configurações">
                    <Text style={{ color: colors.text }}>
                        Cor do calendário: {coach.schedulerColor ?? 'Não definida'}
                    </Text>
                </FormSection>
            </ScrollView>
        </SafeAreaView>
    )
}
