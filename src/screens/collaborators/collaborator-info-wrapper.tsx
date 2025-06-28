// src/screens/wrappers/collaborator-info-wrapper.tsx
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import LoadingScreen from '../loadin-screen';
import { useEffect } from 'react';
import { RootStackParamList } from '../../navigation/types';
import CollaboratorInfoScreen from './collaborator-info-screen.tsx';

export default function CollaboratorInfoWrapper() {
    const route = useRoute<RouteProp<RootStackParamList, 'CollaboratorDetails'>>();
    const navigation = useNavigation();

    useEffect(() => {
        if (!route.params?.coachId) {
            navigation.navigate('Home' as never);
        }
    }, [route.params]);

    if (!route.params?.coachId) return <LoadingScreen />;
    return <CollaboratorInfoScreen />;
}
