// components/ui/form-modal.tsx
import React from 'react';
import { Modal, SafeAreaView, ScrollView, View, Button } from 'react-native';
import { useTheme } from '../../context/theme-context';
import { FormSection } from './form-section';

type FormModalProps = {
    visible: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
};

export const FormModal: React.FC<FormModalProps> = ({ visible, title, children, onClose }) => {
    const { colors } = useTheme();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                <ScrollView contentContainerStyle={{ padding: 16 }}>
                    <FormSection title={title}>
                        {children}
                        <View style={{ marginTop: 16 }}>
                            <Button title="Cancelar" color={colors.danger} onPress={onClose} />
                        </View>
                    </FormSection>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};
