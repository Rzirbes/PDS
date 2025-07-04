import React, { useState } from 'react';
import {
    View,
    ScrollView,
    Text,
    Button,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,

    Alert,
    Modal,
    TouchableOpacity,
} from 'react-native';

import { useTheme } from '../../context/theme-context';
import { FormSection } from '../../components/ui/form-section';
import { z } from 'zod';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useDayWellBeing } from '../../hooks/use-day-well-being';
import { WellBeingForm } from '../../components/training/well-being-form';
import { PainFormValues, painSchema } from '../../components/pain/pain-form';
import { injurySchema } from '../../components/injury/injury-form';
import { useFinishTrainingForm } from '../../hooks/use-finish-training';
import { useTrainingTypes } from '../../hooks/use-training-types';
import { Training } from '../../components/schedule/schedule-component';
import { PainSection } from '../../components/pain/pain-section';
import { InjurySection } from '../../components/injury/injury-section';
import { TrainingDetailsFormSection } from '../../components/schedule/training-details-form-section';
import { getMinutes } from 'date-fns';
import { ChevronLeft } from 'lucide-react-native';
import navigation from '../../navigation';
import { BackButton } from '../../components/ui/back-button';

type RouteParams = {
    training: Training
};

export const trainingSchema = z.object({
    date: z.coerce.date({
        errorMap: (issue, { defaultError }) => ({
            message: issue.code === 'invalid_date' ? 'Data do treino é obrigatória' : defaultError,
        }),
    }),
    type: z.string().min(1, 'Tipo de treino é obrigatório'),
    duration: z.coerce.number().min(1, 'Duração é obrigatória'),
    description: z.string().optional(),
    psr: z.coerce.number().min(0).max(10),
    pse: z.coerce.number().min(0).max(10),
    trainingTypeUuid: z.string().min(1, 'Tipo de treino é obrigatório'),
    pains: z.array(painSchema),
    injuries: z.array(injurySchema),
    trainingPlanningUuid: z.string().optional(),
});



export function FinishTrainingScreen() {
    const { colors } = useTheme();
    const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();

    const training = route.params?.training;
    console.log("route finish training: ", training.trainingPlanning)
    const { summary, mutate } = useDayWellBeing(training.athleteId, new Date(training.date))

    const [showWellBeingForm, setShowWellBeingForm] = useState(false)


    const { trainingTypes, isLoading } = useTrainingTypes();




    const duration =
        training.startTime && training.endTime
            ? getMinutes(training.endTime) - getMinutes(training.startTime)
            : 0;
    const {
        control,
        handleSubmit,
        handleFormSubmit,
        watch,
        painFields,
        addPain,
        removePain,
        injuryFields,
        addInjury,
        removeInjury,
    } = useFinishTrainingForm(training);


    console.log('Training recebido:', training)
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>


                <Modal
                    visible={showWellBeingForm}
                    animationType="slide"
                    onRequestClose={() => setShowWellBeingForm(false)}
                >
                    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                            <BackButton />
                        </View>
                        <ScrollView contentContainerStyle={{ padding: 16 }}>
                            <WellBeingForm
                                athleteId={training.athleteId}
                                dateTraining={new Date(training.date)}
                                onCancel={() => setShowWellBeingForm(false)}
                                onSuccess={() => {
                                    setShowWellBeingForm(false);
                                    mutate();
                                }}
                            />
                        </ScrollView>
                    </SafeAreaView>
                </Modal>
                <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
                    >
                        <ScrollView contentContainerStyle={{ padding: 16 }}>
                            <FormSection title="Formulário de Bem estar">
                                {summary.length === 0 && (
                                    <>
                                        <Text style={{ color: 'red', marginBottom: 10 }}>
                                            ⚠️ O questionário de bem-estar ainda não foi preenchido para este dia.
                                        </Text>
                                        <Button
                                            title="Informar Avaliação"
                                            color={colors.primary}
                                            onPress={() => setShowWellBeingForm(true)}
                                        />
                                    </>
                                )}
                            </FormSection>
                            <TrainingDetailsFormSection control={control} trainingTypes={trainingTypes} />

                            <PainSection
                                pains={painFields as PainFormValues[]}
                                onAddPain={(newPain) => addPain(newPain)}
                                onDeletePain={(index) => removePain(index)}
                            />

                            <InjurySection
                                injuries={injuryFields}
                                onAddInjury={(injury) => addInjury(injury)}
                                onDeleteInjury={(index) => removeInjury(index)}
                            />


                            <Button title="Salvar Treino" color={colors.success} onPress={() => {
                                if (summary.length === 0) {
                                    Alert.alert("Aviso", "Preencha o questionário de bem-estar antes de finalizar o treino.");
                                    return;
                                }
                                handleFormSubmit();
                            }} />
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </View>
        </TouchableWithoutFeedback >
    );
}


