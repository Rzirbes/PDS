import { View, Text } from 'react-native'
import EntityListScreen from '../components/entity-list-screen'
import type { TrainingType } from '../types/training-type'
import TrainingTypeItemCard from '../components/training-type-item-card'

const MOCK_TRAINING_TYPES: TrainingType[] = [
    { id: '1', name: 'Força' },
    { id: '2', name: 'Velocidade' },
    { id: '3', name: 'Resistência' },
]

export default function TrainningTypesScreen() {
    return (
        <EntityListScreen
            title="Tipos de Treinos"
            placeholder="Buscar tipo de treino..."
            data={MOCK_TRAINING_TYPES}
            onFabPress={() => console.log('Cadastrar tipo de treino')}
            renderItem={(item) => <TrainingTypeItemCard item={item} />}
            searchBy={(item, query) =>
                item.name.toLowerCase().includes(query.toLowerCase())
            }
        />
    )
}
