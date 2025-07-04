// components/ui/controlled-checkbox.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Control, Controller } from 'react-hook-form';
import { useTheme } from '../../context/theme-context';
import ExpoCheckbox from 'expo-checkbox';

interface ControlledCheckboxProps {
    name: string;
    control: Control<any>;
    label: string;
}

export default function ControlledCheckbox({ name, control, label }: ControlledCheckboxProps) {
    const { colors } = useTheme();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <ExpoCheckbox
                        value={field.value ?? false}
                        onValueChange={field.onChange}
                    />
                    <Text style={{ color: colors.text }}>{label}</Text>
                </View>
            )}
        />
    );
}
