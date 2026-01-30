import { Text, ActivityIndicator } from 'react-native'
import EntityListScreen from '../../components/entity-list-screen'
import TrainingTypeItemCard from '../../components/training-type-item-card'
import { useTrainingTypes } from '../../hooks/use-training-types'
import { useState } from 'react'
import CreateTrainingTypeModal from './create-trainning-type-modal'

export default function TrainningTypesScreen() {
  const { trainingTypes, isLoading, isError, refresh } = useTrainingTypes()
  const [open, setOpen] = useState(false)

  if (isLoading) return <ActivityIndicator />
  if (isError) return <Text>Erro ao carregar tipos de treino</Text>

  return (
    <>
      <EntityListScreen
        title="Tipos de Treinos"
        placeholder="Buscar tipo de treino..."
        data={trainingTypes}
        showBackButton
        onFabPress={() => setOpen(true)}
        renderItem={(item) => <TrainingTypeItemCard item={item} />}
        searchBy={(item, query) => item.name.toLowerCase().includes(query.toLowerCase())}
      />

      <CreateTrainingTypeModal
        visible={open}
        onClose={() => setOpen(false)}
        onCreated={refresh}
      />
    </>
  )
}
