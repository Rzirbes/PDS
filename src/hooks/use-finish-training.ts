import { useState } from "react";
import { finishTraining } from "../services/training-service";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Training } from "../components/schedule/schedule-component";
import { trainingSchema } from "../screens/schedule/finish-training-screen";
import z from "zod";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getSchedulesKey, useSchedules } from "./use-schedule";
import useSWR, { mutate } from "swr";
import { getWeekInterval } from "../utils/date-utils";

export function useFinishTraining() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async (data: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await finishTraining(data);
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        submit,
        loading,
        error,
    };
}

export function useFinishTrainingForm(training: Training) {
    const form = useForm<z.infer<typeof trainingSchema>>({
        resolver: zodResolver(trainingSchema),
        defaultValues: {
            date: new Date(training.date),
            type: training?.trainingPlanning?.trainingType?.id || '',
            psr: 0,
            pse: training.pse || 0,
            description: training.notes || '',
            pains: [],
            injuries: [],
            trainingPlanningUuid: training?.trainingPlanning?.id,
        },
    });

    const { submit } = useFinishTraining();
    const navigation = useNavigation();

    const pains = useFieldArray({ control: form.control, name: 'pains' });
    const injuries = useFieldArray({ control: form.control, name: 'injuries' });


    const startDate = new Date(training.date);
    const endDate = new Date(training.date);



    const handleFormSubmit = form.handleSubmit(async (data) => {
        try {
            if (!training.athleteId) {
                Alert.alert('Erro', 'Treino não está vinculado a um atleta.');
                return;
            }

            const payload = {
                trainingPlanningUuid: training.trainingPlanning.id,
                athleteUuid: training.athleteId,
                trainingTypeUuid: data.trainingTypeUuid,
                date: data.date,
                duration: data.duration,
                description: data.description,
                pse: data.pse,
                psr: data.psr,
                pains: data.pains,
                injuries: data.injuries,
            };

            await submit(payload);

            const { startDate, endDate } = getWeekInterval(new Date(training.date));
            mutate(getSchedulesKey(startDate, endDate));


            Alert.alert('Sucesso', 'Treino finalizado com sucesso!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Erro', 'Falha ao finalizar treino.');
        }
    });

    return {
        ...form,
        painFields: pains.fields,
        addPain: pains.append,
        removePain: pains.remove,
        injuryFields: injuries.fields,
        addInjury: injuries.append,
        removeInjury: injuries.remove,
        handleFormSubmit,
    };
}

