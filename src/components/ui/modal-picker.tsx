import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../context/theme-context';

interface ModalPickerProps {
    visible: boolean;
    title: string;
    options: { label: string; value: string }[];
    onSelect: (value: string) => void;
    onClose: () => void;
}

export function ModalPicker({ visible, title, options, onSelect, onClose }: ModalPickerProps) {
    const { colors } = useTheme();

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={[styles.modal, { backgroundColor: colors.background }]}>
                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

                    <FlatList
                        data={options}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => {
                                    onSelect(item.value);
                                    onClose();
                                }}
                            >
                                <Text style={{ color: colors.text }}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={{ color: colors.primary }}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: '80%',
        maxHeight: '70%',
        borderRadius: 8,
        padding: 16,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
    },
    item: {
        paddingVertical: 12,
    },
    closeButton: {
        marginTop: 16,
        alignItems: 'center',
    },
});
