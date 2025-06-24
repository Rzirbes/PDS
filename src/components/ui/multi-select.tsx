import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Button, Modal, TouchableWithoutFeedback } from 'react-native';
import Checkbox from 'expo-checkbox';
import { useTheme } from '../../context/theme-context';
import { FootballPosition, footballPositionLabels } from '../../enums/athelte';

type Option = {
    label: string;
    value: string;
};

type MultiSelectProps = {
    label: string;
    options: Option[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
};

export default function MultiSelect({ label, options, selectedValues, onChange }: MultiSelectProps) {
    const { colors } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);

    function toggleSelection(value: string) {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter((item) => item !== value));
        } else {
            onChange([...selectedValues, value]);
        }
    }

    function getPositionAbbreviation(label: string) {
        const match = label.match(/\(([^)]+)\)$/);
        return match ? match[1] : label;
    }

    return (
        <View style={{ marginBottom: 12 }}>
            <Text style={{ color: colors.text, marginBottom: 4 }}>{label}</Text>

            <TouchableOpacity
                style={[styles.input, { borderColor: colors.border, backgroundColor: colors.surface }]}
                onPress={() => setModalVisible(true)}
            >
                <Text style={{ color: colors.text }}>
                    {selectedValues.length > 0
                        ? selectedValues
                            .map((value) => getPositionAbbreviation(footballPositionLabels[value as FootballPosition]))
                            .join(', ')
                        : 'Selecione as posições'}
                </Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
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
                                        onPress={() => toggleSelection(option.value)}
                                    >
                                        <Checkbox
                                            value={selectedValues.includes(option.value)}
                                            onValueChange={() => toggleSelection(option.value)}
                                            color={colors.primary}
                                        />
                                        <Text style={{ color: colors.text, marginLeft: 8 }}>{option.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <View style={styles.closeButtonContainer}>
                                <Button title="Fechar" onPress={() => setModalVisible(false)} color={colors.primary} />
                            </View>
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
    modalContainer: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    bottomSheet: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    closeButtonContainer: {
        marginBottom: 16,
    },
});
