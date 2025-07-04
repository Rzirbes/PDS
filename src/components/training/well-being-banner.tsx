// components/training/well-being-banner.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { FormSection } from '../ui/form-section';
import { useTheme } from '../../context/theme-context';

type WellBeingBannerProps = {
    summary: any[];
    onPress: () => void;
};

export const WellBeingBanner: React.FC<WellBeingBannerProps> = ({ summary, onPress }) => {
    const { colors } = useTheme();

    if (summary.length > 0) return null;

    return (
        <FormSection title="Formulário de Bem estar">
            <Text style={{ color: 'red', marginBottom: 10 }}>
                ⚠️ O questionário de bem-estar ainda não foi preenchido para este dia.
            </Text>
            <Button title="Informar Avaliação" color={colors.primary} onPress={onPress} />
        </FormSection>
    );
};
