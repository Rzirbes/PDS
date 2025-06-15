import { View, TextInput, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { useTheme } from '../context/theme-context'

type Props = {
    placeholder?: string
    onSearch?: (query: string) => void
}

export default function SearchBar({ placeholder = 'Buscar...', onSearch }: Props) {
    const [query, setQuery] = useState('')
    const { colors } = useTheme()

    function handleChange(text: string) {
        setQuery(text)
        onSearch?.(text)
    }

    return (
        <View style={[styles.container, {
            backgroundColor: colors.background, borderColor: '#fff', borderWidth: 1,
        }]}>
            <Ionicons name="search" size={20} color={colors.muted} />
            <TextInput
                value={query}
                onChangeText={handleChange}
                placeholder={placeholder}
                style={[styles.input, { color: colors.text }]}
                placeholderTextColor={colors.muted}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 16,
    },
    input: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },
})
