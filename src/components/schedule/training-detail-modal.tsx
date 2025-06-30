import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { PositionedTraining } from './schedule-component';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit, Calendar, Trash, Check } from 'lucide-react-native';
import { ActionIconButton } from '../ui/action-icon-button';
import { ActionButton } from '../ui/action-button';
import { useTheme } from '../../context/theme-context';

interface Props {
    visibleTraining: PositionedTraining | null;
    onClose: () => void;
}

export function TrainingDetailsModal({ visibleTraining, onClose }: Props) {
    const { colors: themeColors } = useTheme();
    const navigation = useNavigation<any>();
    console.log('visibleTraining:', JSON.stringify(visibleTraining, null, 2));

    if (!visibleTraining) return null;

    const status = 'PENDING';

    const handleNavigateToAthlete = () => {
        onClose();
        navigation.navigate('AthleteDetails', { athleteId: visibleTraining.athleteName });
    };

    const handleNavigateToCoach = () => {
        onClose();
        navigation.navigate('Collaborators');
    };

    const handleNavigateToTrainingType = () => {
        onClose();
        navigation.navigate('Trainings');
    };

    const handleFinishTraining = () => {
        onClose();
        navigation.navigate('FinishTraining', {
            training: {
                ...visibleTraining,
                athleteId: visibleTraining.athleteId,
            },
        });
    };

    const renderStatusBadge = () => {

        const isPending = status === 'PENDING';
        const backgroundColor = isPending ? themeColors.secondary : themeColors.primary;
        const textColor = isPending ? themeColors.text : themeColors.text;
        const icon = isPending ? <Calendar color={textColor} size={16} /> : <Check color={textColor} size={16} />;
        const label = isPending ? 'Aguardando confirmação do atleta' : 'Confirmado pelo atleta';

        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor,
                    borderRadius: 8,
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    marginTop: 4,
                    alignSelf: 'flex-start',
                }}>
                {icon}
                <Text style={{ color: textColor, marginLeft: 6, fontSize: 12 }}>{label}</Text>
            </View>
        );
    };

    return (
        <Modal transparent animationType="fade" visible={!!visibleTraining} onRequestClose={onClose}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 }}>
                <View style={{ backgroundColor: 'black', padding: 20, borderRadius: 12 }}>

                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 12 }}>Agendamento</Text>

                    <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 8 }}>Dia</Text>
                    <Text style={{ color: 'white' }}>
                        {format(new Date(visibleTraining.date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </Text>

                    <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 8 }}>Hora de início</Text>
                    <Text style={{ color: 'white' }}>{visibleTraining.startTime}</Text>

                    <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 8 }}>Hora do fim</Text>
                    <Text style={{ color: 'white' }}>{visibleTraining.endTime}</Text>

                    <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 8 }}>Atleta</Text>
                    <TouchableOpacity onPress={handleNavigateToAthlete}>
                        <Text style={{ color: 'orange' }}>{visibleTraining.athleteName}</Text>
                    </TouchableOpacity>

                    <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 8 }}>Treinador</Text>
                    <TouchableOpacity onPress={handleNavigateToCoach}>
                        <Text style={{ color: 'orange' }}>{visibleTraining.coachName}</Text>
                    </TouchableOpacity>

                    <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 8 }}>Tipo de Treino</Text>
                    <TouchableOpacity onPress={handleNavigateToTrainingType}>
                        <Text style={{ color: 'orange' }}>{visibleTraining.title}</Text>
                    </TouchableOpacity>

                    <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 8 }}>PSE Planejada</Text>

                    <Text style={{ color: 'orange' }}>{visibleTraining.pse}</Text>
                    <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 8 }}>Status</Text>
                    {renderStatusBadge()}

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 }}>
                        <ActionIconButton icon={Edit} onPress={() => console.log('Editar')} />
                        <ActionIconButton icon={Calendar} onPress={() => console.log('Cancelar')} />
                        <ActionIconButton icon={Trash} onPress={() => console.log('Excluir')} />
                    </View>

                    <ActionButton label="Finalizar Atendimento" onPress={handleFinishTraining} variant="primary" />
                    <ActionButton label="Fechar" onPress={onClose} variant="secondary" />

                </View>
            </View>
        </Modal>
    );
}
