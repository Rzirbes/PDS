import React from 'react';
import { TextInput, View, Text, KeyboardTypeOptions } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import { useTheme } from '../../context/theme-context';

interface InputFieldProps {
    name: string;
    control: Control<any>; // ou defina o tipo correto do seu form
    label: string;
    placeholder?: string;
    keyboardType?: KeyboardTypeOptions;
    multiline?: boolean;
    error?: string;
}

export function InputField({
    name,
    control,
    label,
    placeholder,
    keyboardType = 'default',
    multiline = false,
    error,
}: InputFieldProps) {
    const { colors } = useTheme();

    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={{ color: colors.text, marginBottom: 4 }}>{label}</Text>
            <Controller
                control={control}
                name={name}
                render={({ field: { value, onChange } }) => (
                    <TextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder={placeholder}
                        placeholderTextColor={colors.muted}
                        keyboardType={keyboardType}
                        multiline={multiline}
                        style={{
                            height: multiline ? 80 : 44,
                            borderWidth: 1,
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            color: colors.text,
                            borderColor: colors.border,
                            backgroundColor: colors.surface,
                        }}
                    />
                )}
            />
            {error && <Text style={{ color: colors.danger }}>{error}</Text>}
        </View>
    );
}
