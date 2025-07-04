import React from 'react';
import {
    View,
    ScrollView,
    TextInput,
    Text,
    Switch,
    TouchableOpacity,
    SafeAreaView,
    Modal,
    Platform,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard,
    Alert,
} from 'react-native';
import { useForm, Controller, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { getSchedulesKey, useCreateSchedule } from '../../hooks/use-schedule';
import { useTheme } from '../../context/theme-context';
import SingleSelect from '../../components/ui/single-select';
import { useAthletes } from '../../hooks/use-athlete';
import { useValidatedCoaches } from '../../hooks/use-validate-coaches';
import { useTrainingTypes } from '../../hooks/use-training-types';
import { TimePickerInput } from '../../components/ui/time-picker';
import { DatePickerInput } from '../../components/ui/date-picker-input';
import { useNavigation } from '@react-navigation/native';
import { getWeekInterval } from '../../utils/date-utils';
import { mutate } from 'swr';

const scheduleSchema = z.object({
    date: z.date(),
    timeStart: z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, 'Hora inválida (HH:MM)'),
    timeEnd: z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, 'Hora inválida (HH:MM)'),
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
        setValue,
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
    const { athletes } = useAthletes();
    const { coaches } = useValidatedCoaches();
    function parseTimeString(time: string): Date {
        const [hours, minutes] = time.split(':').map(Number);
        const now = new Date();
        now.setHours(hours || 0);
        now.setMinutes(minutes || 0);
        now.setSeconds(0);
        return now;
    }
    const { trainingTypes } = useTrainingTypes();
    const trainingTypeOptions = trainingTypes.map((t) => ({
        label: t.name,
        value: t.id.toString(),
    }));
    const athleteOptions = athletes.map((a) => ({ label: a.name, value: a.id.toString() }));
    const coachOptions = coaches.map((c) => ({ label: c.name, value: c.id.toString() }));
    const navigation = useNavigation();
    const { submit } = useCreateSchedule();
    const { colors } = useTheme();

    const timeStart = watch('timeStart');
    const timeEnd = watch('timeEnd');

    // Atualiza automaticamente o timeEnd +50 min após selecionar o timeStart
    React.useEffect(() => {
        if (timeStart && /^\d{2}:\d{2}$/.test(timeStart)) {
            const [h, m] = timeStart.split(':').map(Number);
            const start = new Date();
            start.setHours(h);
            start.setMinutes(m + 50);

            const newH = String(start.getHours()).padStart(2, '0');
            const newM = String(start.getMinutes()).padStart(2, '0');

            setValue('timeEnd', `${newH}:${newM}`);
        }
    }, [timeStart]);

    // Atualiza a duração em minutos ao alterar timeStart ou timeEnd
    React.useEffect(() => {
        if (
            timeStart &&
            timeEnd &&
            /^\d{2}:\d{2}$/.test(timeStart) &&
            /^\d{2}:\d{2}$/.test(timeEnd)
        ) {
            const [startH, startM] = timeStart.split(':').map(Number);
            const [endH, endM] = timeEnd.split(':').map(Number);

            const startTotal = startH * 60 + startM;
            const endTotal = endH * 60 + endM;

            const duration = endTotal - startTotal;
            if (duration > 0) setValue('duration', duration);
        }
    }, [timeStart, timeEnd]);

    const onSubmit = async (formData: any) => {
        try {
            const { date, timeStart, timeEnd, athleteId, coachId, trainingTypeId, description, duration, pse } = formData;

            const [startHour, startMinute] = timeStart.split(':');
            const [endHour, endMinute] = timeEnd.split(':');

            const start = new Date(date);
            start.setHours(Number(startHour), Number(startMinute), 0);

            const end = new Date(date);
            end.setHours(Number(endHour), Number(endMinute), 0);

            const dto = {
                start,
                end,
                athleteId,
                coachId,
                trainingPlanning: {
                    trainingTypeId,
                    duration,
                    pse,
                    description,
                },
            };


            const response = await submit(dto);
            const { startDate, endDate } = getWeekInterval(new Date(date));
            mutate(getSchedulesKey(startDate, endDate));
            Alert.alert('Agendamento criado com sucesso!');
            navigation.goBack();
        } catch (err: any) {
            Alert.alert('Erro ao criar agendamento:', err.message);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
                >

                    <ScrollView contentContainerStyle={{ padding: 16 }}>
                        <Text style={{ color: colors.text, fontSize: 18, marginBottom: 12 }}>Agendar para</Text>

                        <Controller
                            control={control}
                            name="date"
                            render={({ field: { onChange, value } }) => (
                                <DatePickerInput
                                    label="Data do agendamento"
                                    value={value}
                                    onChange={onChange}
                                    error={errors.date?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="timeStart"
                            render={({ field: { onChange, value } }) => (
                                <TimePickerInput
                                    label="Hora de início"
                                    value={value}
                                    onChange={onChange}
                                    error={errors.timeStart?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="timeEnd"
                            render={({ field: { onChange, value } }) => (
                                <TimePickerInput
                                    label="Hora do fim"
                                    value={value}
                                    onChange={onChange}
                                    error={errors.timeEnd?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="athleteId"
                            render={({ field: { onChange, value } }) => (
                                <>
                                    <SingleSelect
                                        label="Atleta"
                                        options={athleteOptions}
                                        selectedValue={value}
                                        onChange={onChange}
                                    />
                                    <Text style={{ color: colors.danger, marginBottom: 4 }}>
                                        {errors.athleteId?.message}
                                    </Text>
                                </>
                            )}
                        />

                        <Controller
                            control={control}
                            name="coachId"
                            render={({ field: { onChange, value } }) => (
                                <>
                                    <SingleSelect
                                        label="Treinador"
                                        options={coachOptions}
                                        selectedValue={value}
                                        onChange={onChange}
                                    />
                                    <Text style={{ color: colors.danger, marginBottom: 4 }}>
                                        {errors.coachId?.message}
                                    </Text>
                                </>
                            )}
                        />
                        <Controller
                            control={control}
                            name="trainingTypeId"
                            render={({ field: { onChange, value } }) => (
                                <>
                                    <SingleSelect
                                        label="Tipo de treino"
                                        options={trainingTypeOptions}
                                        selectedValue={value}
                                        onChange={onChange}
                                    />
                                    <Text style={{ color: colors.danger, marginBottom: 4 }}>
                                        {errors.trainingTypeId?.message}
                                    </Text>
                                </>
                            )}
                        />

                        <Controller
                            control={control}
                            name="description"
                            render={({ field: { onChange, value } }) => (
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={{ color: colors.text, marginBottom: 4 }}>Descrição do Treino</Text>
                                    <TextInput
                                        placeholder="Descrição do Treino"
                                        value={value}
                                        onChangeText={onChange}
                                        multiline
                                        placeholderTextColor={colors.muted}
                                        style={{
                                            height: 44,
                                            borderWidth: 1,
                                            borderRadius: 8,
                                            paddingHorizontal: 12,
                                            color: colors.text,
                                            borderColor: colors.border,
                                        }}
                                    />
                                </View>
                            )}
                        />


                        <Controller
                            control={control}
                            name="duration"
                            render={({ field }) => (
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={{ color: colors.text, marginBottom: 4 }}>Duração do Treino</Text>
                                    <TextInput

                                        keyboardType="numeric"
                                        value={field.value.toString()}
                                        onChangeText={(val) => field.onChange(val.replace(/\D/g, ''))}
                                        placeholder="Duração (min)"
                                        placeholderTextColor={colors.muted}
                                        style={{
                                            height: 44,
                                            borderWidth: 1,
                                            borderRadius: 8,
                                            paddingHorizontal: 12,
                                            color: colors.text,
                                            borderColor: colors.border,
                                            marginBottom: 8,
                                        }}
                                    />
                                    <Text style={{ color: colors.danger }}>{errors.duration?.message}</Text>
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="pse"
                            render={({ field: { onChange, value } }) => (
                                <View style={{ marginBottom: 16 }}>
                                    <Text style={{ color: colors.text, marginBottom: 4 }}>PSE Planejado</Text>
                                    <TextInput
                                        value={String(value)}
                                        onChangeText={(val) => onChange(Number(val))}
                                        keyboardType="numeric"
                                        placeholder="0-10"
                                        placeholderTextColor={colors.muted}
                                        style={{
                                            height: 44,
                                            borderWidth: 1,
                                            borderRadius: 8,
                                            paddingHorizontal: 12,
                                            color: colors.text,
                                            borderColor: colors.border,
                                            marginBottom: 8,
                                        }}
                                    />
                                    <Slider
                                        style={{ width: '100%', height: 40 }}
                                        minimumValue={0}
                                        maximumValue={10}
                                        step={1}
                                        value={value}
                                        onValueChange={onChange}
                                        minimumTrackTintColor={colors.primary}
                                        maximumTrackTintColor={colors.border}
                                        thumbTintColor={colors.primary}
                                    />
                                    <Text style={{ color: colors.danger }}>{errors.pse?.message}</Text>
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="hasRecurrence"
                            render={({ field: { value, onChange } }) => (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                    <Text style={{ color: colors.text, marginRight: 8 }}>Habilitar recorrência</Text>
                                    <Switch
                                        value={value}
                                        onValueChange={onChange}
                                        trackColor={{ false: colors.muted, true: colors.primary }}
                                        thumbColor={value ? colors.primary : colors.border}
                                    />
                                </View>
                            )}
                        />

                        <TouchableOpacity
                            onPress={handleSubmit(onSubmit)}
                            style={{
                                backgroundColor: colors.primary,
                                padding: 14,
                                borderRadius: 8,
                                alignItems: 'center',
                                marginTop: 8,
                            }}
                        >
                            <Text style={{ color: colors.background, fontWeight: 'bold' }}>Agendar</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>


            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
function combineDateAndTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number)
    const result = new Date(date)
    result.setHours(hours || 0)
    result.setMinutes(minutes || 0)
    result.setSeconds(0)
    result.setMilliseconds(0)
    return result
}
