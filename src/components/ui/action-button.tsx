import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { useTheme } from '../../context/theme-context';

interface Props {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
    style?: ViewStyle;
}

export function ActionButton({ label, onPress, variant = 'primary', style }: Props) {
    const { colors: themeColors } = useTheme();

    const baseStyle: ViewStyle = {
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    };

    const stylesByVariant: Record<typeof variant, ViewStyle> = {
        primary: {
            backgroundColor: themeColors.primary,
        },
        secondary: {
            borderWidth: 1,
            borderColor: themeColors.muted,
        },
    };

    const textColor = variant === 'primary' ? themeColors.text : themeColors.text;

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                ...baseStyle,
                ...stylesByVariant[variant],
                ...style,
            }}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: textColor }}>{label}</Text>
        </TouchableOpacity>
    );
}
