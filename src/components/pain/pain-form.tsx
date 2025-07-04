import React from 'react';
import {
    View,
    Text,
    Button,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { InputField } from '../ui/input-field';
import { DatePickerInput } from '../ui/date-picker-input';
import SingleSelect from '../ui/single-select';
import { BodySide, InjuryContext } from '../../types/enums';
import { enumToOptions } from '../../utils/enum-top-options';
import { BodySideLabel, InjuryContextLabel } from '../../enums/injury';
import TextArea from '../ui/text-area';
import { TextField } from '../ui/text-field';
import { SliderField } from '../ui/slider-field';

export const painSchema = z.object({
    date: z.date(),
    bodyRegion: z.string().min(1, 'Local da dor é obrigatório'),
    bodySide: z.nativeEnum(BodySide),
    occurredDuring: z.nativeEnum(InjuryContext),
    description: z.string().max(2000).optional(),
    intensity: z.coerce.number().min(0).max(10),
});

export type PainFormValues = z.infer<typeof painSchema>;

interface Props {
    defaultValues?: Partial<PainFormValues>;
    onSubmit: (data: PainFormValues) => void;
}

export function PainForm({ defaultValues, onSubmit }: Props) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<PainFormValues>({
        resolver: zodResolver(painSchema),
        defaultValues: {
            date: new Date(),
            ...defaultValues,
        },
    });

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={{ padding: 16 }}>
                        <View style={{ gap: 12 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Dor muscular</Text>

                            <Controller
                                control={control}
                                name="date"
                                render={({ field }) => (
                                    <DatePickerInput
                                        label="Data da dor"
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={errors.date?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="bodyRegion"
                                render={({ field }) => (
                                    <TextField
                                        label="Local da Dor"
                                        placeholder="Ex: posterior da coxa, lombar..."
                                        value={field.value}
                                        onChangeText={field.onChange}
                                        error={errors.bodyRegion?.message}
                                    />
                                )}
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

                            <SliderField
                                control={control}
                                name="intensity"
                                label="Intensidade"
                            />

                            <Controller
                                control={control}
                                name="occurredDuring"
                                render={({ field }) => (
                                    <SingleSelect
                                        label="Ocorreu durante"
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
                                        label="Descreva a dor"
                                        placeholder="Resumo geral da dor/lesão"
                                        value={field.value}
                                        onChangeText={field.onChange}
                                        error={errors.description?.message}
                                    />
                                )}
                            />

                            <Button onPress={handleSubmit(onSubmit)} title="Salvar dor" />
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
