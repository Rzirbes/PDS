// components/HeaderWithBack.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { ReactNode } from 'react'
import { useTheme } from '../../context/theme-context'
import { Feather } from '@expo/vector-icons'

type Props = {
    title: string | ReactNode
}

export default function HeaderWithBack({ title }: Props) {
    const navigation = useNavigation()
    const { colors } = useTheme()

    return (
        <View style={[styles.header, { backgroundColor: colors.background }]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather name="chevron-left" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <View style={{ width: 60 }} />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backText: {
        fontSize: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
})
