// src/components/coaches/coach-form.tsx

import { View, Text, Button, Switch, StyleSheet, ScrollView } from 'react-native'
import { Controller, UseFormReturn } from 'react-hook-form'

import ThemedInput from '../ui/themedInput'
import { FormSection } from '../ui/form-section'
import ColorPicker from 'react-native-wheel-color-picker'

interface CoachFormProps {
  form: UseFormReturn<any>
  colors: any
  title: string
  onSubmit: () => void
  isEdit?: boolean
  renderExtraSections?: React.ReactNode
}

const inputFields = [
  { name: 'name', label: 'Nome', placeholder: 'Nome do colaborador' },
  { name: 'email', label: 'Email', placeholder: 'email@dominio.com' },
  { name: 'cpf', label: 'CPF', placeholder: 'CPF (opcional)' },
  { name: 'phone', label: 'Telefone', placeholder: '(99) 99999-9999 (opcional)' }
]

export function CoachForm({ form, colors, title, onSubmit, renderExtraSections }: CoachFormProps) {
  const renderInputs = (fields: string[]) => {
    return fields.map((fieldName) => {
      const f = inputFields.find((i) => i.name === fieldName)
      if (!f) return null

      return (
        <View key={f.name} style={{ marginBottom: 12 }}>
          <Text style={{ color: colors.text, marginBottom: 4 }}>{f.label}</Text>
          <Controller
            control={form.control}
            name={f.name as any}
            render={({ field: { onChange, value } }) => (
              <ThemedInput
                placeholder={f.placeholder}
                onChangeText={onChange}
                value={typeof value === 'string' ? value : ''}
                autoCapitalize="none"
              />
            )}
          />
        </View>
      )
    })
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      <FormSection title="Dados do Colaborador">
        {renderInputs(['name', 'email', 'cpf', 'phone'])}
      </FormSection>

      <FormSection title="Status">
        <Controller
          control={form.control}
          name="isEnabled"
          render={({ field: { value, onChange } }) => (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: colors.text, marginBottom: 4 }}>Ativo no sistema</Text>
              <Switch value={!!value} onValueChange={onChange} />
            </View>
          )}
        />
      </FormSection>

      <FormSection title="Agenda">
  <Controller
    control={form.control}
    name="schedulerColor"
    render={({ field: { value, onChange } }) => (
      <View style={{ gap: 12 }}>
        {/* Preview */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              backgroundColor: typeof value === 'string' ? value : '#3B82F6',
              borderWidth: 1,
              borderColor: colors.border
            }}
          />
          <Text style={{ color: colors.text }}>
            {(typeof value === 'string' ? value : '#3B82F6').toUpperCase()}
          </Text>
        </View>

        <ColorPicker
          color={typeof value === 'string' ? value : '#3B82F6'}
          onColorChange={(c: string) => onChange(c)}
          thumbSize={24}
          sliderSize={18}
          noSnap
          row={false}
        />
      </View>
    )}
  />
</FormSection>

      {renderExtraSections}

      <View style={styles.buttonGroup}>
        <Button title="Salvar" onPress={onSubmit} color={colors.primary} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  buttonGroup: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 24 }
})
