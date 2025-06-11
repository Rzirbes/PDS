import { View, Text } from 'react-native'
import EntityListScreen from '../../components/entity-list-screen'
import EntityItemCard from '../../components/entity-item-card'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigation/types'
import { useValidatedAthletes } from '../../hooks/use-validate-athletes'
import { EntityStatus } from '../../types/entity'

export default function AthletesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const { athletes, isLoading } = useValidatedAthletes()

  const listData = athletes.map((athlete) => ({
    id: String(athlete.id),
    name: athlete.name,
    email: athlete.email,
    status: (athlete.isEnabled ? 'Ativo' : 'Inativo') as EntityStatus,

  }))

  return (
    <EntityListScreen
      title="Atletas"
      placeholder="Buscar por atleta..."
      isLoading={isLoading}
      data={listData}
      onFabPress={() => console.log('Cadastrar atleta')}
      renderItem={(item) => (
        <EntityItemCard
          item={item}
          onPress={() =>
            navigation.navigate('AthleteDetails', { athleteId: item.id })
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
