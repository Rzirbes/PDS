import React, { useState } from 'react';
import { Modal, TouchableOpacity, Text, View } from 'react-native';
import { useTheme } from '../../context/theme-context';
import ColorPicker, { Panel3 } from 'reanimated-color-picker';

interface Props {
    label: string;
    color: string;
    onColorChange: (color: string) => void;
}

export function ColorPickerModal({ label, color, onColorChange }: Props) {
    const { colors } = useTheme();
    const [open, setOpen] = useState(false);
    const [tempColor, setTempColor] = useState(color);

    const handleChange = (colorData: { hex: string }) => {
        setTempColor(colorData.hex);
    };

    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={{ color: colors.text, marginBottom: 8 }}>{label}</Text>

            <TouchableOpacity
                onPress={() => setOpen(true)}
                style={{
                    backgroundColor: color,
                    height: 40,
                    borderRadius: 6,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: '#fff' }}>{color}</Text>
            </TouchableOpacity>

            <Modal visible={open} transparent animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ backgroundColor: '#fff', margin: 20, borderRadius: 8, padding: 16 }}>
                        <ColorPicker
                            value={tempColor}
                            onChange={handleChange}
                            onComplete={() => {
                                onColorChange(tempColor);
                                setOpen(false);
                            }}
                            style={{ height: 300 }}
                        >
                            <Panel3 />
                        </ColorPicker>

                        <TouchableOpacity
                            onPress={() => setOpen(false)}
                            style={{
                                marginTop: 16,
                                backgroundColor: colors.primary,
                                padding: 12,
                                borderRadius: 6,
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ color: '#fff' }}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
