import React from 'react';
import { View, ScrollView, TextInput, Text, Button, Switch } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const scheduleSchema = z.object({
    date: z.date(),
    timeStart: z.string().min(1, 'Hora de início é obrigatória'),
    timeEnd: z.string().min(1, 'Hora de fim é obrigatória'),
    athleteId: z.string().min(1, 'Atleta é obrigatório'),
    coachId: z.string().min(1, 'Treinador é obrigatório'),
    trainingTypeId: z.string().min(1, 'Tipo de Treino é obrigatório'),
    description: z.string().optional(),
    duration: z.coerce.number().min(1, 'Duração é obrigatória'),
    pse: z.coerce.number().min(0, 'PSE é obrigatória'),
    hasRecurrence: z.boolean(),
});

export default function ScheduleFormScreen() {
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            date: new Date(),
            timeStart: '',
            timeEnd: '',
            athleteId: '',
            coachId: '',
            trainingTypeId: '',
            description: '',
            duration: 0,
            pse: 0,
            hasRecurrence: false,
        },
    });

    const hasRecurrence = watch('hasRecurrence');

    const onSubmit = (data: any) => {
        console.log('Form data:', data);
        // Aqui vai o fetch para envio da API
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            <Text>Agendar para</Text>

            <Controller
                control={control}
                name="date"
                render={({ field: { onChange, value } }) => (
                    <DateTimePicker
                        value={value}
                        mode="date"
                        display="default"
                        onChange={(_, selectedDate) => onChange(selectedDate || value)}
                    />
                )}
            />

            <Controller
                control={control}
                name="timeStart"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="Hora de início (HH:MM)"
                        value={value}
                        onChangeText={onChange}
                        style={{ borderBottomWidth: 1, marginBottom: 8 }}
                    />
                )}
            />
            <Text style={{ color: 'red' }}>{errors.timeStart?.message}</Text>

            <Controller
                control={control}
                name="timeEnd"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="Hora do fim (HH:MM)"
                        value={value}
                        onChangeText={onChange}
                        style={{ borderBottomWidth: 1, marginBottom: 8 }}
                    />
                )}
            />
            <Text style={{ color: 'red' }}>{errors.timeEnd?.message}</Text>

            <Controller
                control={control}
                name="athleteId"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="ID do Atleta"
                        value={value}
                        onChangeText={onChange}
                        style={{ borderBottomWidth: 1, marginBottom: 8 }}
                    />
                )}
            />
            <Text style={{ color: 'red' }}>{errors.athleteId?.message}</Text>

            <Controller
                control={control}
                name="coachId"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="ID do Treinador"
                        value={value}
                        onChangeText={onChange}
                        style={{ borderBottomWidth: 1, marginBottom: 8 }}
                    />
                )}
            />
            <Text style={{ color: 'red' }}>{errors.coachId?.message}</Text>

            <Controller
                control={control}
                name="trainingTypeId"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="Tipo de Treino"
                        value={value}
                        onChangeText={onChange}
                        style={{ borderBottomWidth: 1, marginBottom: 8 }}
                    />
                )}
            />
            <Text style={{ color: 'red' }}>{errors.trainingTypeId?.message}</Text>

            <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="Descrição do Treino"
                        value={value}
                        onChangeText={onChange}
                        multiline
                        style={{ borderWidth: 1, marginBottom: 8 }}
                    />
                )}
            />

            <Controller
                control={control}
                name="duration"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="Duração (min)"
                        value={value.toString()}
                        onChangeText={(val) => onChange(Number(val))}
                        keyboardType="numeric"
                        style={{ borderBottomWidth: 1, marginBottom: 8 }}
                    />
                )}
            />
            <Text style={{ color: 'red' }}>{errors.duration?.message}</Text>

            <Controller
                control={control}
                name="pse"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder="PSE Planejado"
                        value={value.toString()}
                        onChangeText={(val) => onChange(Number(val))}
                        keyboardType="numeric"
                        style={{ borderBottomWidth: 1, marginBottom: 8 }}
                    />
                )}
            />
            <Text style={{ color: 'red' }}>{errors.pse?.message}</Text>

            <Controller
                control={control}
                name="hasRecurrence"
                render={({ field: { value, onChange } }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                        <Text>Habilitar recorrência</Text>
                        <Switch value={value} onValueChange={onChange} />
                    </View>
                )}
            />

            <Button title="Agendar" onPress={handleSubmit(onSubmit)} />
        </ScrollView>
    );
}
