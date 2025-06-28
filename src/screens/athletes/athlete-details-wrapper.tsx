// src/screens/wrappers/athlete-details-wrapper.tsx
import { useRoute, useNavigation } from '@react-navigation/native';
import AthleteDetailsScreen from '../athletes/athlete-details-screen';
import { RouteProp } from '@react-navigation/native';
import LoadingScreen from '../loadin-screen';
import { useEffect } from 'react';
import { RootStackParamList } from '../../navigation/types';

export default function AthleteDetailsWrapper() {
    const route = useRoute<RouteProp<RootStackParamList, 'AthleteDetails'>>();
    const navigation = useNavigation();

    useEffect(() => {
        if (!route.params?.athleteId) {
            navigation.navigate('Home' as never);
        }
    }, [route.params]);

    if (!route.params?.athleteId) {
        return <LoadingScreen />;
    }

    return <AthleteDetailsScreen />;
}
