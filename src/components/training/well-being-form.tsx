import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { View, Text, Button, Alert } from 'react-native'
import { z } from 'zod'
import { Angry, Frown, Laugh, Meh, Smile } from 'lucide-react-native'
import SingleSelect from '../ui/single-select'
import { useCaptureWellBeing } from '../../hooks/use-day-well-being'
import { CaptureWellBeingPayload } from '../../services/well-being-service'

const wellBeingSchema = z.object({
    sleep: z.string().min(1, 'Obrigatório'),
    sleepHours: z.string().min(1, 'Obrigatório'),
    energy: z.string().min(1, 'Obrigatório'),
    stress: z.string().min(1, 'Obrigatório'),
    nutrition: z.string().min(1, 'Obrigatório'),
    waterIntake: z.string().min(1, 'Obrigatório'),
    pain: z.string().min(1, 'Obrigatório'),
    fatigue: z.string().min(1, 'Obrigatório'),
    humor: z.string().min(1, 'Obrigatório'),
    motivation: z.string().min(1, 'Obrigatório'),
})

type FormData = z.infer<typeof wellBeingSchema>

interface WellBeingFormProps {
    athleteId: string
    onSuccess?: () => void
    onCancel?: () => void
}

export const ratingOptions = [
    { label: 'Péssima', value: '1', icon: () => <Angry size={20} color="#ef4444" /> },
    { label: 'Ruim', value: '2', icon: () => <Frown size={20} color="#f97316" /> },
    { label: 'Normal', value: '3', icon: () => <Meh size={20} color="#facc15" /> },
    { label: 'Boa', value: '4', icon: () => <Smile size={20} color="#4ade80" /> },
    { label: 'Excelente', value: '5', icon: () => <Laugh size={20} color="#22c55e" /> },
]

export function WellBeingForm({ onCancel, onSuccess, athleteId }: WellBeingFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(wellBeingSchema),
    })

    const { submit, loading } = useCaptureWellBeing()

    const fields = [
        { name: 'sleep', label: 'Qualidade do sono' },
        { name: 'sleepHours', label: 'Horas de sono' },
        { name: 'energy', label: 'Energia' },
        { name: 'stress', label: 'Nível de stress' },
        { name: 'nutrition', label: 'Alimentação' },
        { name: 'waterIntake', label: 'Ingestão de água' },
        { name: 'pain', label: 'Dor' },
        { name: 'fatigue', label: 'Fadiga' },
        { name: 'humor', label: 'Humor' },
        { name: 'motivation', label: 'Motivação' },
    ] as const

    const handleWellBeingSubmit = async (formData: FormData) => {
        const payload: CaptureWellBeingPayload = {
            athleteId,
            date: new Date(),
            sleep: Number(formData.sleep),
            sleepHours: Number(formData.sleepHours),
            energy: Number(formData.energy),
            stress: Number(formData.stress),
            nutrition: Number(formData.nutrition),
            waterIntake: Number(formData.waterIntake),
            pain: Number(formData.pain),
            fatigue: Number(formData.fatigue),
            humor: Number(formData.humor),
            motivation: Number(formData.motivation),
        }

        try {
            await submit(payload)
            Alert.alert('Sucesso', 'Avaliação de bem-estar enviada com sucesso!')
            onSuccess?.()
        } catch {
            Alert.alert('Erro', 'Não foi possível enviar a avaliação.')
        }
    }

    return (
        <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
                Avaliação de Bem-estar
            </Text>

            {fields.map(field => (
                <Controller
                    key={field.name}
                    name={field.name}
                    control={control}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <SingleSelect
                            label={field.label}
                            selectedValue={value}
                            onChange={onChange}
                            options={ratingOptions.map(opt => ({
                                value: opt.value,
                                label: opt.label,
                                icon: opt.icon?.(),
                            }))}
                            error={error?.message}
                        />
                    )}
                />
            ))}

            <View>
                <Button
                    title={loading ? 'Salvando...' : 'Salvar Avaliação'}
                    onPress={handleSubmit(handleWellBeingSubmit)}
                    disabled={loading}
                />
                {onCancel && (
                    <Button title="Cancelar" onPress={onCancel} color="#ef4444" />
                )}
            </View>
        </View>
    )
}
