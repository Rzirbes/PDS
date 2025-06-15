import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/theme-context'

type Props = {
    icon?: string
    label?: string
    onPress: () => void
}

export default function FloatingActionButton({ icon = 'add', label, onPress }: Props) {
    const { colors } = useTheme()

    return (
        <TouchableOpacity
            style={[styles.fab, { backgroundColor: colors.primary }]}
            onPress={onPress}
        >
            <Ionicons name={icon as any} size={24} color="#fff" />
            {label && <Text style={[styles.label]}>{label}</Text>}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        borderRadius: 50,
        padding: 16,
        elevation: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        color: '#fff',
        marginLeft: 8,
        fontWeight: 'bold',
    },
})
