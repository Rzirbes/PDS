import React from 'react';
import { Text, TextInput, View, TextInputProps } from 'react-native';
import { useTheme } from '../../context/theme-context';

interface Props extends TextInputProps {
    label: string;
}

export function LabeledInput({ label, ...textInputProps }: Props) {
    const { colors } = useTheme();

    return (
        <View style={{ marginBottom: 8 }}>
            <Text style={{ color: colors.text, marginBottom: 4 }}>{label}</Text>
            <TextInput
                {...textInputProps}
                style={[
                    {
                        borderWidth: 1,
                        borderColor: colors.muted,
                        color: colors.text,
                        height: 30,
                        borderRadius: 8,
                        paddingHorizontal: 8,
                    },
                    textInputProps.style,
                ]}
            />
        </View>
    );
}
