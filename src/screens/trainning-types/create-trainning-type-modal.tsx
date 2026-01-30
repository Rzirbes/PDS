import { useEffect } from 'react'
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { showMessage } from 'react-native-flash-message'
import { Feather } from '@expo/vector-icons'

import { useTheme } from '../../context/theme-context'
import { useCreateTrainingType } from '../../hooks/use-training-types'
import ThemedInput from '../../components/ui/themedInput'

const schema = z.object({
  name: z.string().min(1, 'Informe o nome'),
  description: z.string().optional()
})

type FormData = z.infer<typeof schema>

type Props = {
  visible: boolean
  onClose: () => void
  onCreated?: () => void
}

export default function CreateTrainingTypeModal({ visible, onClose, onCreated }: Props) {
  const { colors } = useTheme()
  const { createTrainingType } = useCreateTrainingType()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '' }
  })

  const { control, handleSubmit, reset, formState } = form
  const { isSubmitting } = formState

  useEffect(() => {
    // quando fechar, limpa o form
    if (!visible) reset({ name: '', description: '' })
  }, [visible, reset])

  async function onSubmit(values: FormData) {
    try {
      await createTrainingType({
        name: values.name.trim(),
        description: values.description?.trim() ? values.description.trim() : undefined
      })

      showMessage({
        message: 'Sucesso',
        description: 'Tipo de treino criado com sucesso!',
        type: 'success'
      })

      onClose()
      onCreated?.()
    } catch (err: any) {
      // teu apiFetch dá throw new Error("Erro 400: ...")
      showMessage({
        message: 'Erro',
        description: err?.message ?? 'Falha ao criar tipo de treino.',
        type: 'danger'
      })
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Cadastrar tipo de treino</Text>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="x" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 12 }}>
            <Text style={[styles.label, { color: colors.text }]}>Nome *</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <>
                  <ThemedInput
                    placeholder="Ex: Musculação"
                    value={value}
                    onChangeText={onChange}
                  />
                  {!!error?.message && (
                    <Text style={styles.error}>{error.message}</Text>
                  )}
                </>
              )}
            />
          </View>

          <View style={{ marginTop: 12 }}>
            <Text style={[styles.label, { color: colors.text }]}>Descrição (opcional)</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <ThemedInput
                  placeholder="Ex: Treinos de força/hipertrofia"
                  value={value ?? ''}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.btn,
                styles.btnGhost,
                { borderColor: colors.primary, opacity: isSubmitting ? 0.7 : 1 }
              ]}
              disabled={isSubmitting}
            >
              <Text style={{ color: colors.text }}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={[
                styles.btn,
                { backgroundColor: colors.primary, opacity: isSubmitting ? 0.7 : 1 }
              ]}
              disabled={isSubmitting}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  card: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 18,
    fontWeight: '700'
  },
  label: {
    marginBottom: 6,
    fontSize: 14
  },
  error: {
    marginTop: 6,
    fontSize: 12,
    color: 'tomato'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 18
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10
  },
  btnGhost: {
    borderWidth: 1
  }
})
