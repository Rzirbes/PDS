import React, { useEffect, useState } from 'react';
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
    TextInput,
    Alert,
    Modal,
} from 'react-native';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useTheme } from '../../context/theme-context';
import { FormSection } from '../../components/ui/form-section';
import { InputField } from '../../components/ui/input-field';
import { DatePickerInput } from '../../components/ui/date-picker-input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SliderField } from '../../components/ui/slider-field';
import { useDayWellBeing } from '../../hooks/use-day-well-being';
import { WellBeingForm } from '../../components/training/well-being-form';
import { mutate } from 'swr';

type RouteParams = {
    training: {
        id: string;
        date: string;
        title: string;
        startTime: string;
        endTime: string;
        pse: number;
        notes?: string;
        coachId?: string;
        athleteId?: string;
        duration?: string;
    };
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
    pains: z.array(z.object({ location: z.string() })),
    injuries: z.array(z.object({ type: z.string() })),
});

export function FinishTrainingScreen() {
    const { colors } = useTheme();
    const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
    const training = route.params?.training;
    const { summary } = useDayWellBeing(training.athleteId, new Date(training.date))
    const startMin = getMinutes(training.startTime)
    const endMin = getMinutes(training.endTime)
    const [showWellBeingForm, setShowWellBeingForm] = useState(false)

    const {
        control,
        handleSubmit,
        reset,
        ...rest
    } = useForm<z.infer<typeof trainingSchema>>({
        resolver: zodResolver(trainingSchema),
        defaultValues: {
            date: new Date(),
            type: '',
            duration: 0,
            description: '',
            psr: 0,
            pse: 0,
            pains: [{ location: '' }],
            injuries: [{ type: '' }],
        },
    });

    useEffect(() => {
        if (training) {
            const getMinutes = (time: string) => {
                const [h, m] = time.split(':').map(Number);
                return h * 60 + m;
            };

            const duration =
                training.startTime && training.endTime
                    ? getMinutes(training.endTime) - getMinutes(training.startTime)
                    : 0;
            reset({
                date: new Date(training.date),
                type: training.title || '',
                duration,
                psr: 0,
                pse: training.pse || 0,
                description: training.notes || '',
                pains: [{ location: '' }],
                injuries: [{ type: '' }],
            });
        }
    }, [training]);

    function getMinutes(time: string) {
        const [h, m] = time.split(':').map(Number);
        return h * 60 + m;
    }
    const { fields: painFields, append: addPain, remove: removePain } = useFieldArray({
        control,
        name: 'pains',
    });

    const { fields: injuryFields, append: addInjury, remove: removeInjury } = useFieldArray({
        control,
        name: 'injuries',
    });

    const onSubmit = (data: any) => {
        console.log(data);
    };
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
                        <ScrollView contentContainerStyle={{ padding: 16 }}>
                            <FormSection title="Avaliação de Bem-Estar">
                                {training.athleteId ? (
                                    <WellBeingForm
                                        athleteId={training.athleteId}
                                        onCancel={() => setShowWellBeingForm(false)}
                                        onSuccess={async () => {
                                            await mutate([
                                                `athlete-${training.athleteId}-well-being-${new Date(training.date).toISOString()}`,
                                                training.athleteId,
                                                new Date(training.date)
                                            ])
                                            setShowWellBeingForm(false)
                                        }}
                                    />
                                ) : (
                                    <Text style={{ color: 'red' }}>
                                        ⚠️ Treino sem atleta vinculado. Não é possível preencher bem-estar.
                                    </Text>
                                )}
                            </FormSection>
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
                            <FormSection title="Cadastrar Treino Concluído">
                                <Controller
                                    control={control}
                                    name="date"
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <DatePickerInput
                                            label="Data do Treino"
                                            value={value}
                                            onChange={onChange}
                                            error={error?.message}
                                        />
                                    )}
                                />
                                <InputField control={control} name="type" label="Tipo de Treino" placeholder="Livre, Força..." />
                                <Controller
                                    control={control}
                                    name="duration"
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <View>
                                            <Text style={{ color: colors.text, marginBottom: 4 }}>Duração</Text>
                                            <TextInput
                                                value={value?.toString() ?? ''}
                                                onChangeText={text => onChange(Number(text))}
                                                keyboardType="numeric"
                                                placeholder="Duração"
                                                style={{
                                                    height: 44,
                                                    borderWidth: 1,
                                                    borderRadius: 8,
                                                    paddingHorizontal: 12,
                                                    color: colors.text,
                                                    borderColor: colors.border,
                                                    backgroundColor: colors.surface,
                                                    marginBottom: 14
                                                }}
                                            />
                                        </View>

                                    )}
                                />
                                <InputField control={control} name="description" label="Resumo" placeholder="Resumo..." multiline />
                                <SliderField control={control} name="psr" label="PSR" />
                                <SliderField control={control} name="pse" label="PSE" />
                            </FormSection>

                            <FormSection title="Cadastrar Dores">
                                {painFields.map((item, index) => (
                                    <View key={item.id} style={{ marginBottom: 8 }}>
                                        <InputField
                                            control={control}
                                            name={`pains.${index}.location`}
                                            label={`Dor ${index + 1}`}
                                            placeholder="Local da dor"
                                        />
                                        <Button color={colors.danger} title="Remover" onPress={() => removePain(index)} />
                                    </View>
                                ))}
                                <Button title="Adicionar Dor" color={colors.primary} onPress={() => addPain({ location: '' })} />
                            </FormSection>

                            <FormSection title="Cadastrar Lesões">
                                {injuryFields.map((item, index) => (
                                    <View key={item.id} style={{ marginBottom: 8 }}>
                                        <InputField
                                            control={control}
                                            label={`Lesão ${index + 1}`}
                                            name={`injuries.${index}.type`}
                                            placeholder="Tipo de lesão"
                                        />
                                        <Button color={colors.danger} title="Remover" onPress={() => removeInjury(index)} />
                                    </View>
                                ))}
                                <Button title="Adicionar Lesão" color={colors.primary} onPress={() => addInjury({ type: '' })} />
                            </FormSection>


                            <Button title="Salvar Treino" color={colors.success} onPress={() => {
                                if (summary.length === 0) {
                                    Alert.alert("Aviso", "Preencha o questionário de bem-estar antes de finalizar o treino.");
                                    return;
                                }
                                handleSubmit(onSubmit)();
                            }} />
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </View>
        </TouchableWithoutFeedback>
    );
}
