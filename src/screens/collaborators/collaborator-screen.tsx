// screens/collaborators/index.tsx
import EntityListScreen from '../../components/entity-list-screen'
import EntityItemCard from '../../components/entity-item-card'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigation/types'
import { Entity, EntityStatus } from '../../types/entity'
import { Coach } from '../../services/coach-service'
import { useValidatedCoaches } from '../../hooks/use-validate-coaches'

export default function CollaboratorsScreen() {
    const { coaches, isLoading } = useValidatedCoaches()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    const listData = coaches.map((coach: Coach) => ({
        id: String(coach.id),
        name: coach.name,
        email: coach.email,
        status: (coach.isEnabled ? 'Ativo' : 'Inativo') as EntityStatus,
    }))

    return (
        <EntityListScreen<Entity>
            title="Colaboradores"
            placeholder="Buscar por colaborador..."
            data={listData}
            isLoading={isLoading}
            onFabPress={() => console.log('Cadastrar colaborador')}
            renderItem={(item) => (
                <EntityItemCard
                    item={item}
                    onPress={() =>
                        navigation.navigate('CollaboratorDetails', { coachId: item.id })
                    }
                />
            )}
            searchBy={(item, query) =>
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.email.toLowerCase().includes(query.toLowerCase())
            }
        />
    )
}
