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
import ScheduleScreen from '../screens/schedule/schedule-screen';
import LoadingScreen from '../screens/loadin-screen';
import CollaboratorInfoWrapper from '../screens/collaborators/collaborator-info-wrapper';
import EditAthleteWrapper from '../screens/athletes/edit-athlete-wrapper';
import AthleteDetailsWrapper from '../screens/athletes/athlete-details-wrapper';
import CreateAthleteScreen from '../screens/athletes/create-athlete-screen';
import ScheduleFormScreen from '../screens/schedule/schedule-form-screen';
import { FinishTrainingScreen } from '../screens/schedule/finish-training-screen';
import { getAccessToken } from '../services/session-service';

const Stack = createNativeStackNavigator<RootStackParamList>();

const routeParamsAreValid = (routeName: keyof RootStackParamList, params: any) => {
  const validators: Partial<Record<keyof RootStackParamList, (p: any) => boolean>> = {
    AthleteDetails: (p) => !!p?.athleteId,
    EditAthlete: (p) => !!p?.athleteId,
    CollaboratorDetails: (p) => !!p?.coachId,
  }

  const validate = validators[routeName]
  return validate ? validate(params) : true
}

export default function Routes() {
  const { token, isLoading } = useAuth();
  const navRef = useNavigationContainerRef();

  useEffect(() => {
    const unsubscribe = navRef.addListener('state', () => {
      const route = navRef.getCurrentRoute();
      if (route && token) {
        AsyncStorage.setItem('@last_route', JSON.stringify({
          name: route.name,
          params: route.params ?? undefined,
        }));
      }
    });

    return unsubscribe;
  }, [navRef]);

  useEffect(() => {
    const restore = async () => {
      const storedToken = await getAccessToken()
      const lastRouteRaw = await AsyncStorage.getItem('@last_route')

      if (!storedToken || !lastRouteRaw) return

      try {
        const lastRoute = JSON.parse(lastRouteRaw) as {
          name: keyof RootStackParamList
          params?: any
        }

        const canNavigate = routeParamsAreValid(lastRoute.name, lastRoute.params)

        if (!navigationRef.isReady()) return

        if (canNavigate) {
          navigationRef.navigate(lastRoute.name, lastRoute.params)
        } else {
          navigationRef.navigate('Home')
        }
      } catch (error) {
        console.warn('Falha ao restaurar rota:', error)
        if (navigationRef.isReady()) navigationRef.navigate('Home')
      }
    }

    const timeout = setTimeout(restore, 500)
    return () => clearTimeout(timeout)
  }, [])


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
