// components/ui/ThemedInput.tsx
import { TextInput, StyleSheet, TextInputProps } from 'react-native'
import { useTheme } from '../../context/ThemeContext'

export default function ThemedInput(props: TextInputProps) {
    const { colors } = useTheme()

    return (
        <TextInput
            placeholderTextColor={colors.muted}
            style={[styles.input, { color: colors.text, borderColor: colors.muted }]}
            {...props}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
    },
})
