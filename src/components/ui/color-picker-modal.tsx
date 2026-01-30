import React, { useMemo, useState, useEffect, useCallback } from 'react'
import {
  Modal,
  TouchableOpacity,
  Text,
  View,
  Pressable,
  TextInput,
  Platform
} from 'react-native'
import { useTheme } from '../../context/theme-context'
import ColorPicker, { Panel3, HueSlider, OpacitySlider } from 'reanimated-color-picker'

interface Props {
  label: string
  color: string
  onColorChange: (color: string) => void
}

type PickerColor = { hex?: string }

const PRESET_COLORS = [
  '#3B82F6', '#22C55E', '#A855F7', '#F97316',
  '#EF4444', '#EAB308', '#06B6D4', '#8B5CF6',
  '#10B981', '#F43F5E', '#94A3B8', '#FFFFFF'
]

// --- helpers ---
function normalizeHex(input: string) {
  let v = input.trim().toUpperCase()
  if (!v) return ''
  if (!v.startsWith('#')) v = `#${v}`
  const isValid = /^#([0-9A-F]{3}|[0-9A-F]{6})$/.test(v)
  return isValid ? v : input.trim()
}

function expandHex3(hex: string) {
  if (/^#([0-9A-F]{3})$/i.test(hex)) {
    const h = hex.replace('#', '')
    return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`.toUpperCase()
  }
  return hex.toUpperCase()
}

function getReadableTextColor(hex: string) {
  const h = expandHex3(hex).replace('#', '')
  if (!/^[0-9A-F]{6}$/i.test(h)) return '#FFFFFF'
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 160 ? '#111111' : '#FFFFFF'
}

export function ColorPickerModal({ label, color, onColorChange }: Props) {
  const { colors } = useTheme()
  const [open, setOpen] = useState(false)

  const [tempColor, setTempColor] = useState(color)
  const [hexInput, setHexInput] = useState(color)

  useEffect(() => {
    if (open) {
      const c = expandHex3(color.toUpperCase())
      setTempColor(c)
      setHexInput(c)
    }
  }, [open, color])

  const buttonTextColor = useMemo(() => getReadableTextColor(color), [color])
  const previewTextColor = useMemo(() => getReadableTextColor(tempColor), [tempColor])

  const handleChange = useCallback((colorData: PickerColor) => {
    const nextHex = colorData?.hex
    if (typeof nextHex === 'string' && nextHex.trim()) {
      const normalized = expandHex3(nextHex.toUpperCase())
      setTempColor(normalized)
      setHexInput(normalized)
    }
  }, [])

  const cancel = useCallback(() => {
    const c = expandHex3(color.toUpperCase())
    setTempColor(c)
    setHexInput(c)
    setOpen(false)
  }, [color])

  const save = useCallback(() => {
    const normalized = normalizeHex(hexInput)
    const finalHex = expandHex3(normalized || tempColor)
    onColorChange(finalHex)
    setOpen(false)
  }, [hexInput, tempColor, onColorChange])

  const applyHexInput = useCallback(() => {
    const normalized = normalizeHex(hexInput)
    if (normalized.startsWith('#')) {
      const finalHex = expandHex3(normalized)
      setTempColor(finalHex)
      setHexInput(finalHex)
    }
  }, [hexInput])

  const setPreset = useCallback((hex: string) => {
    const finalHex = expandHex3(hex.toUpperCase())
    setTempColor(finalHex)
    setHexInput(finalHex)
  }, [])

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: colors.text, marginBottom: 8, fontSize: 14 }}>
        {label}
      </Text>

      {/* Campo clicável (estilo input) */}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          paddingHorizontal: 12,
          height: 48,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.surface
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              backgroundColor: color,
              borderWidth: 1,
              borderColor: colors.border
            }}
          />
          <Text style={{ color: colors.text, fontWeight: '600' }}>
            {color.toUpperCase()}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ color: colors.muted }}>Editar</Text>
          <Text style={{ color: colors.muted, fontSize: 18 }}>›</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={cancel}>
        {/* backdrop */}
        <Pressable
          onPress={cancel}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: 16,
            justifyContent: 'center'
          }}
        >
          {/* card */}
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border
            }}
          >
            {/* header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>
                Selecionar cor
              </Text>

              <TouchableOpacity onPress={cancel} accessibilityRole="button">
                <Text style={{ color: colors.muted, fontSize: 18 }}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* preview */}
            <View
              style={{
                marginTop: 12,
                borderRadius: 14,
                padding: 12,
                backgroundColor: tempColor,
                borderWidth: 1,
                borderColor: colors.border
              }}
            >
              <Text style={{ color: previewTextColor, fontWeight: '800' }}>
                {tempColor.toUpperCase()}
              </Text>
              <Text style={{ color: previewTextColor, opacity: 0.9, marginTop: 2 }}>
                Pré-visualização
              </Text>
            </View>

            {/* presets */}
            <View style={{ marginTop: 12 }}>
              <Text style={{ color: colors.text, marginBottom: 8, opacity: 0.9 }}>
                Sugestões
              </Text>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {PRESET_COLORS.map((hex) => {
                  const selected = expandHex3(hex) === expandHex3(tempColor)
                  return (
                    <TouchableOpacity
                      key={hex}
                      onPress={() => setPreset(hex)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 999,
                        backgroundColor: hex,
                        borderWidth: selected ? 2 : 1,
                        borderColor: selected ? colors.primary : colors.border
                      }}
                    />
                  )
                })}
              </View>
            </View>

            {/* picker */}
            <View style={{ marginTop: 14 }}>
              <ColorPicker value={tempColor} onChange={handleChange} style={{ height: 250 }}>
                <Panel3 />
                <View style={{ height: 12 }} />
                <HueSlider />
                <View style={{ height: 12 }} />
                <OpacitySlider />
              </ColorPicker>
            </View>

            {/* hex input */}
            <View style={{ marginTop: 12 }}>
              <Text style={{ color: colors.text, marginBottom: 6, opacity: 0.9 }}>
                HEX
              </Text>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TextInput
                  value={hexInput}
                  onChangeText={setHexInput}
                  onBlur={applyHexInput}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  placeholder="#RRGGBB"
                  placeholderTextColor={colors.muted}
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
                    color: colors.text,
                    backgroundColor: colors.background
                  }}
                />

                <TouchableOpacity
                  onPress={applyHexInput}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    justifyContent: 'center',
                    backgroundColor: colors.surface
                  }}
                >
                  <Text style={{ color: colors.text, fontWeight: '700' }}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* actions */}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              <TouchableOpacity
                onPress={cancel}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: 'center',
                  backgroundColor: colors.surface
                }}
              >
                <Text style={{ color: colors.text, fontWeight: '800' }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={save}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: colors.primary,
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '800' }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}
