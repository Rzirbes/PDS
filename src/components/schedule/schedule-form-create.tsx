// components/forms/ScheduleForm.tsx
import React from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Text,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { Controller } from 'react-hook-form';
import SingleSelect from '../ui/single-select';
import { TimePickerInput } from '../ui/time-picker';
import { DatePickerInput } from '../ui/date-picker-input';
import Slider from '@react-native-community/slider';
import { useTheme } from '../../context/theme-context';

interface ScheduleFormProps {
  control: any;
  errors: any;
  onSubmit: (formData: any) => void | Promise<void>;
  handleSubmit: any;
  athleteOptions: any[];
  coachOptions: any[];
  trainingTypeOptions: any[];
}

export function ScheduleForm({
  control,
  errors,
  onSubmit,
  handleSubmit,
  athleteOptions,
  coachOptions,
  trainingTypeOptions,
}: ScheduleFormProps) {
  const { colors } = useTheme();

  return (
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
            <SingleSelect label="Atleta" options={athleteOptions} selectedValue={value} onChange={onChange} />
            <Text style={{ color: colors.danger }}>{errors.athleteId?.message}</Text>
          </>
        )}
      />

      <Controller
        control={control}
        name="coachId"
        render={({ field: { onChange, value } }) => (
          <>
            <SingleSelect label="Treinador" options={coachOptions} selectedValue={value} onChange={onChange} />
            <Text style={{ color: colors.danger }}>{errors.coachId?.message}</Text>
          </>
        )}
      />

      <Controller
        control={control}
        name="trainingTypeId"
        render={({ field: { onChange, value } }) => (
          <>
            <SingleSelect label="Tipo de treino" options={trainingTypeOptions} selectedValue={value} onChange={onChange} />
            <Text style={{ color: colors.danger }}>{errors.trainingTypeId?.message}</Text>
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
  );
}
