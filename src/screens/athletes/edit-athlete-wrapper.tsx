// src/screens/wrappers/edit-athlete-wrapper.tsx
import { useRoute, useNavigation } from '@react-navigation/native';
import EditAthleteScreen from '../athletes/edit-athletes-screem';
import { RouteProp } from '@react-navigation/native';
import LoadingScreen from '../loadin-screen';
import { useEffect } from 'react';
import { RootStackParamList } from '../../navigation/types';

export default function EditAthleteWrapper() {
    const route = useRoute<RouteProp<RootStackParamList, 'EditAthlete'>>();
    const navigation = useNavigation();

    useEffect(() => {
        if (!route.params?.athleteId) {
            navigation.navigate('Home' as never);
        }
    }, [route.params]);

    if (!route.params?.athleteId) return <LoadingScreen />;
    return <EditAthleteScreen />;
}
