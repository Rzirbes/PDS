import React from 'react';
import Slider from '@react-native-community/slider';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { useTheme } from '../../context/theme-context';
import { Text, View } from 'react-native';

interface SliderFieldProps<T extends FieldValues> {
    control: any;
    name: Path<T>;
    label: string;
    min?: number;
    max?: number;
    step?: number;
}

export function SliderField<T extends FieldValues>({
    control,
    name,
    label,
    min = 0,
    max = 10,
    step = 1,
}: SliderFieldProps<T>) {
    const { colors } = useTheme();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ color: colors.text, marginBottom: 4 }}>
                        {label}: {value}
                    </Text>
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={min}
                        maximumValue={max}
                        step={step}
                        value={value}
                        onValueChange={onChange}
                        minimumTrackTintColor={colors.primary}
                        maximumTrackTintColor={colors.border}
                        thumbTintColor={colors.primary}
                    />
                    {error && <Text style={{ color: colors.danger }}>{error.message}</Text>}
                </View>
            )}
        />
    );
}
