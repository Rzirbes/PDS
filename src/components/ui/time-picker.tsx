// components/TimePickerInput.tsx
import React from 'react';
import {
    View,
    Text,
    TextInput,
    Modal,
    Platform,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../context/theme-context';

interface TimePickerInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export function TimePickerInput({ label, value, onChange, error }: TimePickerInputProps) {
    const [showPicker, setShowPicker] = React.useState(false);
    const parseTimeString = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(hours || 0);
        date.setMinutes(minutes || 0);
        return date;
    };
    const [tempDate, setTempDate] = React.useState(parseTimeString(value || '00:00'));
    const { colors } = useTheme();


    const handleConfirmIOS = () => {
        const hours = tempDate.getHours().toString().padStart(2, '0');
        const minutes = tempDate.getMinutes().toString().padStart(2, '0');
        onChange(`${hours}:${minutes}`);
        setShowPicker(false);
    };

    const handleChangeAndroid = (_: any, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) {
            const hours = selectedDate.getHours().toString().padStart(2, '0');
            const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
            onChange(`${hours}:${minutes}`);
        }
    };

    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={{ color: colors.text, marginBottom: 4 }}>{label}</Text>

            <TextInput
                value={value || '00:00'}
                onPressIn={() => {
                    setTempDate(parseTimeString(value || '00:00'));
                    setShowPicker(true);
                }}
                editable={false}
                placeholder={label}
                placeholderTextColor={colors.muted}
                style={{
                    height: 44,
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    color: colors.text,
                    borderColor: colors.border,
                    justifyContent: 'center',
                }}
            />

            {showPicker && (
                Platform.OS === 'android' ? (
                    <DateTimePicker
                        mode="time"
                        display="default"
                        value={parseTimeString(value || '00:00')}
                        is24Hour
                        onChange={handleChangeAndroid}
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
                                    mode="time"
                                    display="spinner"
                                    value={tempDate}
                                    is24Hour
                                    onChange={(_, selectedDate) => {
                                        if (selectedDate) {
                                            setTempDate(selectedDate);
                                        }
                                    }}
                                />
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

