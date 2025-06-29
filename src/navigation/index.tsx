import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

import { navigationRef } from './navigationRef';
import { RootStackParamList } from './types';

import HomeScreen from '../screens/home-screen';
import LoginScreen from '../screens/login';
import AthletesScreen from '../screens/athletes/athletes-screen';
import TrainningTypesScreen from '../screens/trainning-types-screen';
import CollaboratorsScreen from '../screens/collaborators/collaborator-screen';
import AthleteDetailsScreen from '../screens/athletes/athlete-details-screen';
import ScheduleScreen from '../screens/schedule/schedule-screen';
import LoadingScreen from '../screens/loadin-screen';
import CollaboratorInfoScreen from '../screens/collaborators/collaborator-info-screen.tsx';
import EditAthleteScreen from '../screens/athletes/edit-athletes-screem';
import CollaboratorInfoWrapper from '../screens/collaborators/collaborator-info-wrapper';
import EditAthleteWrapper from '../screens/athletes/edit-athlete-wrapper';
import AthleteDetailsWrapper from '../screens/athletes/athlete-details-wrapper';
import CreateAthleteScreen from '../screens/athletes/create-athlete-screen';
import ScheduleFormScreen from '../screens/schedule/schedule-form-screen';
import { FinishTrainingScreen } from '../screens/schedule/finish-training-screen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Define quais rotas exigem parâmetros obrigatórios
const routeNeedsParams = (routeName: keyof RootStackParamList): boolean => {
  const routesWithRequiredParams: Partial<Record<keyof RootStackParamList, (params: any) => boolean>> = {
    AthleteDetails: (params) => !!params?.athleteId,
    EditAthlete: (params) => !!params?.athleteId,
    CollaboratorDetails: (params) => !!params?.coachId,
  };

  const validator = routesWithRequiredParams[routeName];
  return validator ? !validator : false; // Se houver validação e ela falhar, retorna true
};

export default function Routes() {
  const { token, isLoading } = useAuth();
  const navRef = useNavigationContainerRef();

  // Salvar a última rota com seus parâmetros
  useEffect(() => {
    const unsubscribe = navRef.addListener('state', () => {
      const route = navRef.getCurrentRoute();
      if (route) {
        AsyncStorage.setItem('@last_route', JSON.stringify({
          name: route.name,
          params: route.params ?? undefined,
        }));
      }
    });

    return unsubscribe;
  }, [navRef]);

  // Restaurar a última rota
  useEffect(() => {
    const restore = async () => {
      const token = await AsyncStorage.getItem('@token');
      const lastRouteRaw = await AsyncStorage.getItem('@last_route');

      if (token && lastRouteRaw && navigationRef.isReady()) {
        try {
          const lastRoute = JSON.parse(lastRouteRaw) as {
            name: keyof RootStackParamList;
            params?: any;
          };

          if (
            typeof lastRoute.name === 'string' &&
            !routeNeedsParams(lastRoute.name) // se não precisa de params OU
            || (lastRoute.params && !routeNeedsParams(lastRoute.name)) // ou tem os params necessários
          ) {
            navigationRef.navigate({
              name: lastRoute.name,
              params: lastRoute.params,
            });
          } else {
            navigationRef.navigate('Home'); // fallback seguro
          }
        } catch (error) {
          console.warn('Falha ao restaurar rota:', error);
          navigationRef.navigate('Home'); // fallback em caso de erro no JSON
        }
      }
    };

    const timeout = setTimeout(restore, 500);
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Athletes" component={AthletesScreen} />
            <Stack.Screen name="AthleteDetails" component={AthleteDetailsWrapper} />
            <Stack.Screen name="EditAthlete" component={EditAthleteWrapper} />
            <Stack.Screen name="Collaborators" component={CollaboratorsScreen} />
            <Stack.Screen name="Trainings" component={TrainningTypesScreen} />
            <Stack.Screen name="Schedule" component={ScheduleScreen} />
            <Stack.Screen name="CollaboratorDetails" component={CollaboratorInfoWrapper} />
            <Stack.Screen name="CreateAthlete" component={CreateAthleteScreen} />
            <Stack.Screen name="ScheduleCreate" component={ScheduleFormScreen} />
            <Stack.Screen name="FinishTraining" component={FinishTrainingScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
