// src/screens/coaches/CreateCoachScreen.tsx

import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft } from 'lucide-react-native'
import { showMessage } from 'react-native-flash-message'

import { useTheme } from '../../context/theme-context'
import { CoachForm } from '../../components/collaborators/collaborator-form'
import { useCreateCoach } from '../../hooks/use-colaborators'
import { CollaboratorSchema, CollaboratorFormData } from '../../zod/collaborator-schema'

function buildAddress(values: CollaboratorFormData) {
  const address = {
    street: values.street?.trim() || undefined,
    neighborhood: values.neighborhood?.trim() || undefined,
    buildingNumber: values.buildingNumber?.trim() || undefined,
    complement: values.complement?.trim() || undefined,
    zipCode: values.zipCode?.trim() || undefined,
    countryId: values.country || undefined,
    stateId: values.state || undefined,
    cityId: values.city || undefined,
  }

  const hasAny = Object.values(address).some((v) => v !== undefined)
  return hasAny ? address : undefined
}


export default function CreateCoachScreen() {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const { createCoach } = useCreateCoach()

  const [location, setLocation] = useState({
  countryId: null as string | null,
  stateId: null as string | null,
  cityId: null as string | null
})

  const form = useForm<CollaboratorFormData>({
  resolver: zodResolver(CollaboratorSchema),
  defaultValues: {
    name: '',
    email: '',
    cpf: '',
    phone: '',
    isEnabled: true,
    schedulerColor: '#3B82F6',

    country: null,
    state: null,
    city: null,

    zipCode: '',
    street: '',
    buildingNumber: '',
    neighborhood: '',
    complement: '',
  }
})

  const { handleSubmit } = form

  function cleanEmptyStrings(obj: Record<string, any>) {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== '' && v !== undefined))
  }

  async function onSubmit(values: CollaboratorFormData) {
    const payload = cleanEmptyStrings({
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      cpf: values.cpf?.trim() || undefined,
      phone: values.phone?.trim() || undefined,
      isEnabled: values.isEnabled ?? true,
      schedulerColor: values.schedulerColor.trim(),

      address: buildAddress(values),
    })

    try {
      await createCoach(payload)
      showMessage({
        message: 'Sucesso',
        description: 'Colaborador cadastrado com sucesso! Um e-mail foi enviado para definir a senha.',
        type: 'success'
      })
      navigation.goBack()
    } catch {
      showMessage({
        message: 'Erro',
        description: 'Falha ao cadastrar colaborador.',
        type: 'danger'
      })
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <ChevronLeft color={colors.primary} size={24} />
      </TouchableOpacity>

      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.text }]}>Cadastrar colaborador</Text>

        <CoachForm
          form={form}
          colors={colors}
          title="Cadastrar Colaborador"
          onSubmit={handleSubmit(onSubmit)}
          location={location}
          setLocation={setLocation}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  backButton: { marginTop: 12, marginLeft: 16 }
})
