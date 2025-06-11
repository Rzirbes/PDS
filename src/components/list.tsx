import { FlatList, StyleSheet, ViewStyle } from 'react-native'
import type { JSX } from 'react'

type Props<T> = {
    data: T[]
    keyExtractor: (item: T) => string
    renderItem: (item: T) => JSX.Element
    contentContainerStyle?: ViewStyle
}

export default function GenericList<T>({ data, keyExtractor, renderItem, contentContainerStyle }: Props<T>) {
    return (
        <FlatList
            data={data}
            keyExtractor={keyExtractor}
            contentContainerStyle={[styles.container, contentContainerStyle]}
            renderItem={({ item }) => renderItem(item)}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 80,
    },
})
