import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { useTheme } from '../../context/theme-context';

interface Props {
    title: string;
    children: React.ReactNode;
    style?: ViewStyle;
}

export function FormSection({ title, children, style }: Props) {
    const { colors } = useTheme();

    return (
        <View style={[{ marginBottom: 16 }, style]}>
            <Text style={{ fontWeight: 'bold', color: colors.text, marginBottom: 8 }}>{title}</Text>
            {children}
        </View>
    );
}
