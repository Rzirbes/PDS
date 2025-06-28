import { View, Text } from 'react-native';
import EntityListScreen from '../../components/entity-list-screen';
import EntityItemCard from '../../components/entity-item-card';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { EntityStatus } from '../../types/entity';
import { useAthletes } from '../../hooks/use-athlete';
import { useCallback } from 'react';
import { mutate } from 'swr';

export default function AthletesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { athletes, isLoading } = useAthletes();


  useFocusEffect(
    useCallback(() => {
      mutate('athletes');
    }, [])
  );

  const listData = athletes.map((athlete) => ({
    id: String(athlete.id),
    name: athlete.name,
    email: athlete.email ?? '',
    status: (athlete.isEnabled ? 'Ativo' : 'Inativo') as EntityStatus,
  }));

  // console.log('listData final para render:', listData);

  return (
    <EntityListScreen
      title="Atletas"
      showBackButton
      placeholder="Buscar por atleta..."
      isLoading={isLoading}
      data={listData}
      onFabPress={() => navigation.navigate('CreateAthlete')}
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
  );
}
