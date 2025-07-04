import React from 'react';
import {
  View,
  Text,
  Modal,
  Platform,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useTheme } from '../../context/theme-context';

interface DatePickerInputProps {
  label: string;
  value?: Date | null;
  onChange: (value: Date) => void;
  error?: string;
}

export function DatePickerInput({ label, value, onChange, error }: DatePickerInputProps) {
  const [showPicker, setShowPicker] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<Date>(value ?? new Date());
  const { colors } = useTheme();

  const formattedDate = value ? format(value, 'dd MMM yyyy') : 'Selecionar data';

  const handleChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) setTempDate(selectedDate);
    if (Platform.OS === 'android' && selectedDate) {
      onChange(selectedDate);
      setShowPicker(false);
    }
  };

  const confirmIOSDate = () => {
    onChange(tempDate);
    setShowPicker(false);
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: colors.text, marginBottom: 4 }}>{label}</Text>

      <Pressable onPress={() => setShowPicker(true)}>
        <View
          style={{
            height: 44,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 12,
            justifyContent: 'center',
            borderColor: colors.border,
            backgroundColor: colors.background,
          }}
        >
          <Text style={{ color: colors.text }}>
            {formattedDate}
          </Text>
        </View>
      </Pressable>

      {showPicker && (
        Platform.OS === 'android' ? (
          <DateTimePicker
            mode="date"
            display="default"
            value={value ?? new Date()}
            onChange={handleChange}
          />
        ) : (
          <Modal transparent animationType="fade">
            <Pressable
              onPress={() => setShowPicker(false)}
              style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}
            >
              <Pressable
                onPress={() => { }}
                style={{
                  backgroundColor: colors.background,
                  marginHorizontal: 32,
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={tempDate}
                  onChange={(e, selectedDate) => {
                    if (selectedDate) setTempDate(selectedDate);
                  }}
                />

                <TouchableOpacity
                  onPress={confirmIOSDate}
                  style={{
                    marginTop: 16,
                    backgroundColor: colors.primary,
                    padding: 10,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: colors.background, fontWeight: 'bold' }}>
                    Confirmar
                  </Text>
                </TouchableOpacity>
              </Pressable>
            </Pressable>
          </Modal>
        )
      )}

      {error && <Text style={{ color: colors.danger }}>{error}</Text>}
    </View>
  );
}
