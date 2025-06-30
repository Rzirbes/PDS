// components/ui/text-field.tsx
import React from 'react';
import { Text, TextInput, View, KeyboardTypeOptions } from 'react-native';
import { useTheme } from '../../context/theme-context';

interface TextFieldProps {
    label: string;
    placeholder?: string;
    value?: string;
    onChangeText: (text: string) => void;
    keyboardType?: KeyboardTypeOptions;
    multiline?: boolean;
    error?: string;
}

export function TextField({
    label,
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default',
    multiline = false,
    error,
}: TextFieldProps) {
    const { colors } = useTheme();

    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={{ color: colors.text, marginBottom: 4 }}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
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
            {error && <Text style={{ color: colors.danger }}>{error}</Text>}
        </View>
    );
}
