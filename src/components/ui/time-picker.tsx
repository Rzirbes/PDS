// components/ui/time-picker.tsx (ou onde estiver)
import React from 'react'
import { View, Text, TextInput, Modal, Platform, TouchableOpacity, Pressable } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useTheme } from '../../context/theme-context'

interface TimePickerInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
}

Platform.select({
  android: true,
  default: false,
})

export function TimePickerInput({ label, value, onChange, error }: TimePickerInputProps) {
  const { colors } = useTheme()
  const [showPicker, setShowPicker] = React.useState(false)

  const parseTimeString = React.useCallback((timeStr: string) => {
    const [hours, minutes] = (timeStr || '00:00').split(':').map(Number)
    const date = new Date()
    date.setHours(Number.isFinite(hours) ? hours : 0)
    date.setMinutes(Number.isFinite(minutes) ? minutes : 0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
  }, [])

  const [tempDate, setTempDate] = React.useState(parseTimeString(value || '00:00'))

  const open = () => {
    setTempDate(parseTimeString(value || '00:00'))
    setShowPicker(true)
  }

  const handleConfirmIOS = () => {
    const hh = String(tempDate.getHours()).padStart(2, '0')
    const mm = String(tempDate.getMinutes()).padStart(2, '0')
    onChange(`${hh}:${mm}`)
    setShowPicker(false)
  }

  const handleChangeAndroid = (_: any, selectedDate?: Date) => {
    if (!selectedDate) {
      setShowPicker(false)
      return
    }
    const hh = String(selectedDate.getHours()).padStart(2, '0')
    const mm = String(selectedDate.getMinutes()).padStart(2, '0')
    onChange(`${hh}:${mm}`)
    setShowPicker(false)
  }

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: colors.text, marginBottom: 4 }}>{label}</Text>

      <Pressable onPress={open}>
        <TextInput
          value={value || '00:00'}
          editable={false}
          pointerEvents="none"
          placeholder={label}
          placeholderTextColor={colors.muted}
          style={{
            height: 44,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 12,
            color: colors.text,
            borderColor: colors.border,
          }}
        />
      </Pressable>

      {showPicker &&
        (Platform.OS === 'android' ? (
          <DateTimePicker
            mode="time"
            display="default"
            value={parseTimeString(value || '00:00')}
            is24Hour
            onChange={handleChangeAndroid}
          />
        ) : (
          <Modal transparent animationType="fade" onRequestClose={() => setShowPicker(false)}>
            <Pressable
              onPress={() => setShowPicker(false)}
              style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}
            >
              <Pressable
                onPress={() => {}}
                style={{
                  backgroundColor: colors.background,
                  marginHorizontal: 32,
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                {showPicker && Platform.select({ android: true }) &&  (
                    <DateTimePicker
                        mode="time"
                        display="default"
                        value={parseTimeString(value || '00:00')}
                        is24Hour
                        onChange={handleChangeAndroid}
                        themeVariant="dark"
                        accentColor={colors.primary}
                    />
                    )}

                <TouchableOpacity
                  onPress={handleConfirmIOS}
                  style={{
                    marginTop: 16,
                    backgroundColor: colors.primary,
                    padding: 10,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: colors.background, fontWeight: 'bold' }}>Confirmar</Text>
                </TouchableOpacity>
              </Pressable>
            </Pressable>
          </Modal>
        ))}

      {!!error && <Text style={{ color: colors.danger }}>{error}</Text>}
    </View>
  )
}
