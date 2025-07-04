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
    StyleSheet,
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
import { scheduleSchema } from '../../zod/schedule-schema';
import { useAutoDuration } from '../../hooks/use-auto-duration';
import { ScheduleForm } from '../../components/schedule/schedule-form-create';
import { ChevronLeft, Feather } from 'lucide-react-native';
import { BackButton } from '../../components/ui/back-button';




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

    useAutoDuration(watch, setValue);



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
                    {/* Botão de Voltar */}
                    <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                        <BackButton />
                    </View>

                    {/* Formulário de agendamento */}
                    <ScheduleForm
                        control={control}
                        errors={errors}
                        onSubmit={onSubmit}
                        handleSubmit={handleSubmit}
                        athleteOptions={athleteOptions}
                        coachOptions={coachOptions}
                        trainingTypeOptions={trainingTypeOptions}
                    />
                </KeyboardAvoidingView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );

}

const styles = StyleSheet.create({
    backButton: {
        marginTop: 12,
        marginLeft: 16,
    },
});
