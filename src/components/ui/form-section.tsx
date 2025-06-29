import React, { ReactNode, useState } from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/theme-context';

interface Props {
    title: string | ReactNode;
    children: React.ReactNode;
    style?: ViewStyle;
    initialOpen?: boolean;
}

export function FormSection({ title, children, style, initialOpen = true }: Props) {
    const { colors } = useTheme();
    const [isOpen, setIsOpen] = useState(initialOpen);

    return (
        <View
            style={[
                {
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    padding: 12,
                    backgroundColor: colors.background,
                },
                style,
            ]}
        >
            <TouchableOpacity
                onPress={() => setIsOpen(!isOpen)}
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
            >
                <Text style={{ fontWeight: 'bold', color: colors.text, flex: 1 }}>{title}</Text>
                <Feather
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.text}
                />
            </TouchableOpacity>

            {isOpen && children}
        </View>
    );
}

