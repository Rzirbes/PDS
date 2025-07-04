import React from 'react';
import {
    View,
    ScrollView,
    Button,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    TouchableWithoutFeedback,
    Keyboard,
    Text,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DatePickerInput } from '../ui/date-picker-input';
import { InputField } from '../ui/input-field';
import TextArea from '../ui/text-area';
import SingleSelect from '../ui/single-select';
import { BodySideLabel, InjuryContextLabel } from '../../enums/injury';
import { enumToOptions } from '../../utils/enum-top-options';
import { BodySide, InjuryContext, InjuryDegree } from '../../types/enums';
import ControlledDatePickerInput from '../ui/controlled-date-picker-input';
import ExpoCheckbox from 'expo-checkbox/build/ExpoCheckbox';
import { useTheme } from '../../context/theme-context';

export const injurySchema = z.object({
    date: z.date(),
    type: z.string().min(1, 'Tipo de lesão é obrigatório'),
    bodyRegion: z.string().min(1, 'Região do corpo é obrigatória'),
    bodySide: z.nativeEnum(BodySide),
    degree: z.string().min(1, 'Grau é obrigatório'),
    occurredDuring: z.nativeEnum(InjuryContext),
    description: z.string().optional(),
    examType: z.string().optional(),
    diagnosisConfirmed: z.boolean().optional(),
    requiresSurgery: z.boolean().optional(),
    treatmentType: z.string().optional(),
    returnDatePlanned: z.date().optional(),
    returnDateActual: z.date().optional(),
    minutesFirstGame: z.coerce.number().min(0).optional(),
    notes: z.string().optional(),
});
export const defaultInjury = {
    date: new Date(),
    type: '',
    bodyRegion: '',
    bodySide: BodySide.LEFT,
    occurredDuring: InjuryContext.TRAINING,
    degree: InjuryDegree.GRAU_I,
    description: '',
    examType: '',
    diagnosis: '',
    surgery: false,
    treatmentType: '',
    returnDatePlanned: undefined,
    returnDateActual: undefined,
    minutesInFirstGame: undefined,
    generalNotes: '',
};
export type InjuryFormValues = z.infer<typeof injurySchema>;

interface Props {
    defaultValues?: Partial<InjuryFormValues>;
    onSubmit: (data: InjuryFormValues) => void;
}

export function InjuryForm({ defaultValues, onSubmit }: Props) {
    const { colors } = useTheme()
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<InjuryFormValues>({
        resolver: zodResolver(injurySchema),
        defaultValues: {
            date: new Date(),
            ...defaultValues,
        },
    });

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={{ padding: 16 }}>
                        <View style={{ gap: 12 }}>
                            <ControlledDatePickerInput
                                label="Data da lesão"
                                name="date"
                                control={control}
                                error={errors.date?.message}
                            />

                            <InputField
                                name="type"
                                control={control}
                                label="Tipo de lesão"
                                placeholder="Ex: ruptura LCA, distensão..."
                                error={errors.type?.message}
                            />

                            <InputField
                                name="bodyRegion"
                                control={control}
                                label="Região do corpo"
                                placeholder="Ex: joelho, tornozelo..."
                                error={errors.bodyRegion?.message}
                            />
                            <Controller
                                control={control}
                                name="bodySide"
                                render={({ field }) => (
                                    <SingleSelect
                                        label="Lado"
                                        selectedValue={field.value}
                                        onChange={field.onChange}
                                        options={enumToOptions(BodySideLabel)}
                                        error={errors.bodySide?.message}
                                    />
                                )}
                            />
                            <InputField
                                name="degree"
                                control={control}
                                label="Grau"
                                placeholder="Ex: Grau I, II, III..."
                                error={errors.degree?.message}
                            />

                            <Controller
                                control={control}
                                name="occurredDuring"
                                render={({ field }) => (
                                    <SingleSelect
                                        label="Ocorrida durante"
                                        selectedValue={field.value}
                                        onChange={field.onChange}
                                        options={enumToOptions(InjuryContextLabel)}
                                        error={errors.occurredDuring?.message}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="description"
                                render={({ field }) => (
                                    <TextArea
                                        label="Descrição"
                                        placeholder="Como ocorreu..."
                                        value={field.value}
                                        onChangeText={field.onChange}
                                        error={errors.description?.message}
                                    />
                                )}
                            />
                            <InputField
                                name="examType"
                                control={control}
                                label="Tipo de exame"
                                placeholder="RM, Raio-X, Ultrassom..."
                                error={errors.examType?.message}
                            />

                            <Controller
                                control={control}
                                name="diagnosisConfirmed"
                                render={({ field }) => (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                        <ExpoCheckbox
                                            style={{ borderColor: colors.primary }}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            color={colors.primary}
                                        />
                                        <Text style={{ marginLeft: 8, color: 'white' }}>Diagnóstico confirmado?</Text>
                                    </View>
                                )}
                            />

                            <Controller
                                control={control}
                                name="requiresSurgery"
                                render={({ field }) => (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                        <ExpoCheckbox
                                            style={{ borderColor: colors.primary }}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            color={colors.primary}
                                        />
                                        <Text style={{ marginLeft: 8, color: 'white' }}>Necessário cirurgia?</Text>
                                    </View>
                                )}
                            />

                            <InputField
                                name="treatmentType"
                                control={control}
                                label="Tipo de tratamento"
                                placeholder="Fisioterapia, repouso..."
                            />



                            <ControlledDatePickerInput
                                name="returnDatePlanned"
                                control={control}
                                label="Retorno planejado"
                                error={errors.returnDatePlanned?.message}
                            />

                            <ControlledDatePickerInput
                                name="returnDateActual"
                                control={control}
                                label="Retorno real"
                                error={errors.returnDateActual?.message}
                            />


                            <InputField
                                name="minutesFirstGame"
                                control={control}
                                label="Minutos no 1º jogo"
                                keyboardType="numeric"
                            />
                            <Controller
                                control={control}
                                name="notes"
                                render={({ field }) => (
                                    <TextArea
                                        label="Observações gerais"
                                        placeholder="Algo a mais sobre o caso..."
                                        value={field.value}
                                        onChangeText={field.onChange}
                                        error={errors.description?.message}
                                    />
                                )}
                            />
                            <Button color={colors.primary} title="Cadastrar lesão" onPress={handleSubmit(onSubmit)} />
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
