// components/training/training-details-form-section.tsx
import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Controller } from 'react-hook-form';
import { FormSection } from '../ui/form-section';
import { DatePickerInput } from '../ui/date-picker-input';
import { InputField } from '../ui/input-field';
import { SliderField } from '../ui/slider-field';
import SingleSelect from '../ui/single-select';
import { z } from 'zod';
import { useTheme } from '../../context/theme-context';

type TrainingDetailsFormSectionProps = {
    control: any;
    trainingTypes: { id: string; name: string }[];
};

export const TrainingDetailsFormSection: React.FC<TrainingDetailsFormSectionProps> = ({
    control,
    trainingTypes,
}) => {
    const { colors } = useTheme();

    return (
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

            <Controller
                control={control}
                name="trainingTypeUuid"
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <SingleSelect
                        label="Tipo de Treino"
                        selectedValue={value}
                        onChange={onChange}
                        options={trainingTypes.map((type) => ({
                            value: type.id,
                            label: type.name,
                        }))}
                        error={error?.message}
                    />
                )}
            />

            <Controller
                control={control}
                name="duration"
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <View>
                        <Text style={{ color: colors.text, marginBottom: 4 }}>Duração</Text>
                        <TextInput
                            value={value?.toString() ?? ''}
                            onChangeText={(text) => onChange(Number(text))}
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
                                marginBottom: 14,
                            }}
                        />
                    </View>
                )}
            />

            <InputField
                control={control}
                name="description"
                label="Resumo"
                placeholder="Resumo..."
                multiline
            />

            <SliderField<z.infer<typeof control>> control={control} name="psr" label="PSR" />
            <SliderField<z.infer<typeof control>> control={control} name="pse" label="PSE" />
        </FormSection>
    );
};
