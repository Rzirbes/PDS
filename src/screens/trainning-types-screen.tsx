import { View, Text, ActivityIndicator } from 'react-native';
import EntityListScreen from '../components/entity-list-screen';
import TrainingTypeItemCard from '../components/training-type-item-card';
import { useTrainingTypes } from '../hooks/use-training-types'; // se estiver em outro path, ajuste
// import type { TrainingType } from '../types/training-type'; // não precisa mais dos mocks

export default function TrainningTypesScreen() {
    const { trainingTypes, isLoading, isError } = useTrainingTypes();

    if (isLoading) return <ActivityIndicator />;
    if (isError) return <Text>Erro ao carregar tipos de treino</Text>;

    return (
        <EntityListScreen
            title="Tipos de Treinos"
            placeholder="Buscar tipo de treino..."
            data={trainingTypes}
            onFabPress={() => console.log('Cadastrar tipo de treino')}
            renderItem={(item) => <TrainingTypeItemCard item={item} />}
            searchBy={(item, query) =>
                item.name.toLowerCase().includes(query.toLowerCase())
            }
        />
    );
}
