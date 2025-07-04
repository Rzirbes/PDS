// components/ui/BackButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/theme-context';
import { ChevronLeft } from 'lucide-react-native';

export function BackButton() {
    const navigation = useNavigation();
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
        >
            <ChevronLeft color={colors.primary} size={24} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    backButton: {
        padding: 8,
        alignSelf: 'flex-start',
        marginLeft: 0,
    },

});
