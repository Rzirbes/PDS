import React, { JSX, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../context/theme-context';

type Option = {
    label: string;
    value: string;
};

interface SingleSelectProps {
    label: string;
    selectedValue: string;
    onChange: (value: string) => void;
    options: {
        value: string;
        label: string;
        icon?: JSX.Element;
    }[];
    error?: string;
}

export default function SingleSelect({ label, options, selectedValue, onChange, error }: SingleSelectProps) {
    const { colors } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);

    function handleSelect(value: string) {
        onChange(value);
        setModalVisible(false);
    }

    return (
        <View style={{ marginBottom: 12 }}>
            <Text style={{ color: colors.text, marginBottom: 4 }}>{label}</Text>

            <TouchableOpacity
                style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface }]}
                onPress={() => setModalVisible(true)}
            >
                <Text style={{ color: colors.text }}>
                    {selectedValue ? options.find((opt) => opt.value === selectedValue)?.label : 'Selecione...'}
                </Text>
            </TouchableOpacity>
            {error && (
                <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                    {error}
                </Text>
            )}
            <Modal visible={modalVisible} transparent animationType="slide">
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                    style={styles.modalOverlay}
                >
                    <TouchableWithoutFeedback>
                        <View style={[styles.bottomSheet, { backgroundColor: colors.background }]}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>{label}</Text>

                            <ScrollView>
                                {options.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={styles.optionRow}
                                        onPress={() => handleSelect(option.value)}
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                            {option.icon}
                                            {typeof option.label === 'string' ? (
                                                <Text style={{ color: colors.text }}>{option.label}</Text>
                                            ) : (
                                                option.label
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    bottomSheet: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
        paddingBottom: 70,
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    optionRow: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});
