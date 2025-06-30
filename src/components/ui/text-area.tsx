import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { useTheme } from '../../context/theme-context';

interface TextAreaProps {
    label: string;
    placeholder?: string;
    value?: string;
    onChangeText: (text: string) => void;
    error?: string;
}

export default function TextArea({ label, placeholder, value, onChangeText, error }: TextAreaProps) {
    const { colors } = useTheme();

    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={{ color: colors.text, marginBottom: 4 }}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={{
                    height: 100,
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                }}
            />
            {error && <Text style={{ color: colors.danger }}>{error}</Text>}
        </View>
    );
}
