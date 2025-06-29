import React, { useEffect } from 'react';
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
} from 'react-native';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useTheme } from '../../context/theme-context';
import { FormSection } from '../../components/ui/form-section';
import { InputField } from '../../components/ui/input-field';
import { DatePickerInput } from '../../components/ui/date-picker-input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RouteProp, useRoute } from '@react-navigation/native';

type RouteParams = {
    training: {
        date: string;
        title: string;
        startTime: string;
        endTime: string;
        notes?: string;
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

    const startMin = getMinutes(training.startTime)
    const endMin = getMinutes(training.endTime)
    const duration = startMin && endMin ? endMin - startMin : 0


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
            reset({
                date: new Date(training.date),
                type: training.title || '',
                duration,
                psr: 0,
                pse: 0,
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

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
                >
                    <ScrollView contentContainerStyle={{ padding: 16 }}>
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
                            <InputField control={control} name="duration" label="Duração (minutos)" keyboardType="numeric" />
                            <InputField control={control} name="description" label="Resumo" placeholder="Resumo..." multiline />
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

                        <Button title="Salvar Treino" color={colors.success} onPress={handleSubmit(onSubmit)} />
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
