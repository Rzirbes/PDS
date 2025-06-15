import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home-screen';
import LoginScreen from '../screens/login';
import AthletesScreen from '../screens/athletes/athletes-screen';
import TrainningTypesScreen from '../screens/trainning-types-screen';
import CollaboratorsScreen from '../screens/collaborators/collaborator-screen';
import AthleteDetailsScreen from '../screens/athletes/athlete-details-screen';
import ScheduleScreen from '../screens/schedule/schedule-screen';
import { RootStackParamList } from './types';
import LoadingScreen from '../screens/loadin-screen';
import { useAuth } from '../context/auth-context';
import CollaboratorInfoScreen from '../screens/collaborators/collaborator-info-screen.tsx';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
    const { token, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {token ? (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Athletes" component={AthletesScreen} />
                        <Stack.Screen name="AthleteDetails" component={AthleteDetailsScreen} />
                        <Stack.Screen name="Collaborators" component={CollaboratorsScreen} />
                        <Stack.Screen name="Trainings" component={TrainningTypesScreen} />
                        <Stack.Screen name="Schedule" component={ScheduleScreen} />
                        <Stack.Screen name="CollaboratorDetails" component={CollaboratorInfoScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
