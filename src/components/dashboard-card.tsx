import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'

type Props = {
    icon: keyof typeof Feather.glyphMap
    label: string
    onPress: () => void
}

export default function DashboardCard({ icon, label, onPress }: Props) {
    const { colors } = useTheme()

    const dynamicStyles = {
        card: {
            backgroundColor: `${colors.background}CC`, // com opacidade
            shadowColor: colors.text,
            borderWidth: 1,
            borderColor: '#fff',
        },
    }

    return (
        <TouchableOpacity style={[styles.card, dynamicStyles.card]} onPress={onPress}>
            <Feather name={icon} size={28} color={colors.primary} style={styles.icon} />
            <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        width: '47%',
        marginHorizontal: '1%',
        aspectRatio: 1,
        borderRadius: 12,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
        elevation: 4,
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    icon: {
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
})
