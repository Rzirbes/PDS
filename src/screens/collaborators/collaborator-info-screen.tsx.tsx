import React, { useMemo } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack'

import { useTheme } from '../../context/theme-context'
import { FormSection } from '../../components/ui/form-section'
import LoadingScreen from '../loadin-screen'
import { RootStackParamList } from '../../navigation/types'
import { useCoachById } from '../../hooks/use-coach-by-id'

type Props = NativeStackScreenProps<RootStackParamList, 'CollaboratorDetails'>

export default function CollaboratorInfoScreen() {
  const { colors } = useTheme()
  const route = useRoute<Props['route']>()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const { coachId } = route.params
  const { coach, isLoading, isError } = useCoachById(coachId)

  const calendarColor = coach?.schedulerColor ?? '#624f96'

  const addressLabel = useMemo(() => {
    if (!coach?.address) return null

    const a = coach.address
    const parts = [
      a.street ? `${a.street}${a.buildingNumber ? `, ${a.buildingNumber}` : ''}` : null,
      a.neighborhood ?? null,
      a.complement ?? null,
      a.zipCode ? `CEP: ${a.zipCode}` : null,
      a.cityId ?? null,
      a.stateId ?? null,
      a.countryId ?? null
    ].filter(Boolean)

    return parts.length ? parts.join(' • ') : null
  }, [coach?.address])

  function handleEdit() {
    // Se você já tiver uma rota de edição de colaborador, use ela aqui:
    // navigation.navigate('EditCollaborator', { coachId })
    // ou reaproveita tua tela de cadastro/edição, dependendo do fluxo.
  }

  if (isLoading) return <LoadingScreen />

  if (isError || !coach) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Erro ao carregar detalhes do colaborador.</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Informações do Colaborador</Text>

        {/* Informações Básicas */}
        <View style={[styles.sectionCard, { borderColor: colors.muted }]}>
          <FormSection title="Informações Básicas">
            <InfoItem label="Nome" value={coach.name} />
            <InfoItem label="E-mail" value={coach.email} />
            <InfoItem label="Cargo" value={coach.role} />
            <InfoItem label="Celular" value={coach.phone ?? '-'} />
            <InfoItem label="Ativo no sistema" value={coach.isEnabled ? 'Sim' : 'Não'} />
          </FormSection>
        </View>

        {/* Endereço */}
        <View style={[styles.sectionCard, { borderColor: colors.muted }]}>
          <FormSection title="Endereço">
            {addressLabel ? (
              <>
                <InfoItem label="Resumo" value={addressLabel} />
                {/* Se você quiser detalhar por linha, pode manter abaixo também: */}
                <InfoItem label="CEP" value={coach.address?.zipCode} />
                <InfoItem label="Rua" value={coach.address?.street} />
                <InfoItem label="Número" value={coach.address?.buildingNumber} />
                <InfoItem label="Bairro" value={coach.address?.neighborhood} />
                <InfoItem label="Complemento" value={coach.address?.complement} />
                <InfoItem label="Cidade" value={coach.address?.cityId} />
                <InfoItem label="Estado" value={coach.address?.stateId} />
                <InfoItem label="País" value={coach.address?.countryId} />
              </>
            ) : (
              <Text style={[styles.emptyText, { color: colors.text }]}>Nenhum endereço cadastrado.</Text>
            )}
          </FormSection>
        </View>

        {/* Configurações */}
        <View style={[styles.sectionCard, { borderColor: colors.muted }]}>
          <FormSection title="Configurações">
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.text, opacity: 0.6 }]}>Cor do calendário</Text>
                <Text style={[styles.value, { color: colors.text }]}>{calendarColor}</Text>
              </View>

              <View style={[styles.colorPreview, { backgroundColor: calendarColor, borderColor: colors.muted }]} />
            </View>

            {/* Se você quiser tornar clicável e abrir um modal, dá pra colocar aqui,
                mas geralmente isso fica melhor na tela de edição */}
          </FormSection>
        </View>

        {/* CTA */}
        <TouchableOpacity
          onPress={handleEdit}
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Editar informações</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  const { colors } = useTheme()
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ color: colors.text, opacity: 0.6, fontSize: 13 }}>{label}:</Text>
      <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }}>
        {value && String(value).trim() ? String(value) : '-'}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 28 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  sectionCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2
  },

  emptyText: { opacity: 0.7, fontStyle: 'italic' },

  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  label: { fontSize: 13 },
  value: { fontSize: 15, fontWeight: '600' },

  colorPreview: {
    width: 46,
    height: 46,
    borderRadius: 10,
    borderWidth: 1
  },

  primaryButton: {
    marginTop: 4,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15
  }
})
