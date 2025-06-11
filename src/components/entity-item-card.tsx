import { View, Text, TouchableOpacity } from 'react-native'
import type { Entity } from '../types/entity'
import { getEntityItemStyles } from '../styles/entity-item-styles'
import { useTheme } from '../context/ThemeContext'

type Props = {
    item: Entity
    onPress?: () => void
}

export default function EntityItemCard({ item, onPress }: Props) {
    const { colors } = useTheme()
    const styles = getEntityItemStyles(colors)

    return (
        <TouchableOpacity style={styles.item} onPress={onPress}>
            <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
            </View>
            <Text
                style={[
                    styles.status,
                    item.status === 'Ativo' ? styles.active : styles.inactive,
                ]}
            >
                {item.status}
            </Text>
        </TouchableOpacity> 
    )
}
