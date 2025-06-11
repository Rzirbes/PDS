import { JSX, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchBar from './search-bar'
import GenericList from './list'
import FloatingActionButton from './floating-button'
import { useTheme } from '../context/ThemeContext'

type Props<T> = {
    title?: string
    data: T[]
    placeholder?: string
    onFabPress: () => void
    renderItem: (item: T) => JSX.Element
    searchBy?: (item: T, query: string) => boolean
    isLoading?: boolean
}

export default function EntityListScreen<T>({
    title,
    data,
    placeholder = 'Buscar...',
    onFabPress,
    renderItem,
    searchBy,
    isLoading,
}: Props<T>) {
    const { colors } = useTheme()
    const [query, setQuery] = useState('')

    const filteredData = query
        ? data.filter((item) => (searchBy ? searchBy(item, query) : true))
        : data

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {title && <Text style={[styles.title, { color: colors.text }]}>{title}</Text>}
                <SearchBar placeholder={placeholder} onSearch={setQuery} />
                {isLoading ? (
                    <Text style={{ color: colors.text }}>Carregando...</Text> // ou um Spinner
                ) : (
                    <GenericList
                        data={filteredData}
                        keyExtractor={(item) => (item as any).id}
                        renderItem={renderItem}
                    />
                )}
                <FloatingActionButton onPress={onFabPress} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
})
