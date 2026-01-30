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


export default function CreateCoachScreen() {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const { createCoach } = useCreateCoach()

  const form = useForm<CollaboratorFormData>({
    resolver: zodResolver(CollaboratorSchema),
        defaultValues: {
            name: '',
            email: '',
            cpf: '',
            phone: '',
            isEnabled: true,
            schedulerColor: '#3B82F6'
        }
    })

  const { handleSubmit } = form

  function cleanEmptyStrings(obj: Record<string, any>) {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== '' && v !== undefined))
  }

  async function onSubmit(values: CollaboratorFormData) {
    // payload compatível com CreateCoachDto (ajuste se teu DTO tiver outros campos)
    const payload = cleanEmptyStrings({
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    cpf: values.cpf?.trim() || undefined,
    phone: values.phone?.trim() || undefined,
    isEnabled: values.isEnabled ?? true,
    schedulerColor: values.schedulerColor.trim()
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
