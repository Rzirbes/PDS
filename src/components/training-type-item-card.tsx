import { View, Text } from 'react-native'
import { trainingTypeItemStyles as styles } from '../styles/training-type-item-styles'
import type { TrainingType } from '../types/training-type'

type Props = {
    item: TrainingType
}

export default function TrainingTypeItemCard({ item }: Props) {
    return (
        <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
        </View>
    )
}
