import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface Props {
    icon: LucideIcon;
    onPress: () => void;
    iconColor?: string;
    size?: number;
    style?: ViewStyle;
}

export function ActionIconButton({ icon: Icon, onPress, iconColor = 'white', size = 24, style }: Props) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                borderWidth: 1,
                borderColor: '#555',
                borderRadius: 8,
                paddingHorizontal: 20,
                paddingVertical: 8,
                ...style,
            }}>
            <Icon color={iconColor} size={size} />
        </TouchableOpacity>
    );
}
