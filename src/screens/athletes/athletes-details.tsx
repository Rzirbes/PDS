import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Switch, TouchableOpacity } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { useTheme } from '../../context/theme-context';
import ThemedInput from '../../components/ui/themedInput';
import { FormSection } from '../../components/ui/form-section';
import { RootStackParamList } from '../../navigation/types';
import { useAthleteById } from '../../hooks/use-athlete';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronLeft, Feather } from 'lucide-react-native';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  cpf: z.string().optional(),
  phone: z.string().optional(),
  birthday: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  isEnabled: z.boolean().optional(),
  isMonitorDaily: z.boolean().optional(),
  bestSkill: z.string().optional(),
  worstSkill: z.string().optional(),
  goal: z.string().optional(),
  dominantFoot: z.string().optional(),
  positions: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditAthleteScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'EditAthlete'>>();
  const { athleteId } = route.params;

  const { athlete, isLoading } = useAthleteById(athleteId);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      cpf: '',
      phone: '',
      birthday: '',
      height: '',
      weight: '',
      isEnabled: false,
      isMonitorDaily: false,
      bestSkill: '',
      worstSkill: '',
      goal: '',
      dominantFoot: '',
      positions: [],
    },
  });

  const { reset, handleSubmit } = form;

  useEffect(() => {
    if (athlete) {
      reset({
        name: athlete.name,
        email: athlete.email ?? '',
        cpf: athlete.cpf ?? '',
        phone: athlete.phone ?? '',
        birthday: athlete.birthday
          ? new Date(athlete.birthday).toISOString().split('T')[0]
          : '',
        height: athlete.height !== undefined ? String(athlete.height) : '',
        weight: athlete.weight !== undefined ? String(athlete.weight) : '',
        isEnabled: athlete.isEnabled ?? false,
        isMonitorDaily: athlete.isMonitorDaily ?? false,
        bestSkill: athlete.bestSkill ?? '',
        worstSkill: athlete.worstSkill ?? '',
        goal: athlete.goal ?? '',
        dominantFoot: athlete.dominantFoot ?? '',
        positions: athlete.positions ?? [],
      });
    }
  }, [athlete, reset]);

  if (isLoading || !athlete) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.text }}>Carregando atleta...</Text>
      </SafeAreaView>
    );
  }

  async function onSubmit(values: FormData) {
    console.log('Dados submetidos:', values);
    showMessage({
      message: 'Sucesso',
      description: 'Simulação de envio. Conecte com backend para persistir!',
      type: 'success',
    });
    navigation.goBack();
  }

  const inputFields = [
    { name: 'name', label: 'Nome', placeholder: 'Nome' },
    { name: 'email', label: 'Email', placeholder: 'Email' },
    { name: 'cpf', label: 'CPF', placeholder: 'CPF' },
    { name: 'phone', label: 'Telefone', placeholder: 'Telefone' },
    { name: 'birthday', label: 'Data de nascimento', placeholder: 'AAAA-MM-DD' },
    { name: 'height', label: 'Altura', placeholder: 'Ex: 1.75' },
    { name: 'weight', label: 'Peso', placeholder: 'Ex: 70' },
    { name: 'bestSkill', label: 'Melhor habilidade', placeholder: 'Ex: Visão de jogo' },
    { name: 'worstSkill', label: 'Pior habilidade', placeholder: 'Ex: Finalização' },
    { name: 'goal', label: 'Objetivo', placeholder: 'Ex: Melhorar força' },
    { name: 'dominantFoot', label: 'Pé dominante', placeholder: 'Ex: Direito / Esquerdo' },
    // Positions → futuro: multiselect
  ];

  function renderInputs(fields: string[]) {
    return fields.map((fieldName) => {
      const field = inputFields.find((f) => f.name === fieldName);
      if (!field) return null;
      return (
        <View key={field.name} style={{ marginBottom: 12 }}>
          <Text style={{ color: colors.text, marginBottom: 4 }}>{field.label}</Text>
          <Controller
            control={form.control}
            name={field.name as keyof FormData}
            render={({ field: { onChange, value } }) => (
              <ThemedInput
                placeholder={field.placeholder}
                onChangeText={onChange}
                value={typeof value === 'string' ? value : ''}
              />
            )}
          />
        </View>
      );
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <ChevronLeft color={colors.primary} size={24} />
      </TouchableOpacity>
      <ScrollView style={[styles.container]}>

        <Text style={[styles.title, { color: colors.text }]}>Editar atleta</Text>

        <FormSection title="Dados Pessoais">
          {renderInputs(['name', 'email', 'cpf', 'phone', 'birthday'])}

          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: colors.text, marginBottom: 4 }}>Ativo no sistema</Text>
            <Controller
              control={form.control}
              name="isEnabled"
              render={({ field: { onChange, value } }) => (
                <Switch value={!!value} onValueChange={onChange} />
              )}
            />
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: colors.text, marginBottom: 4 }}>Monitorado diariamente</Text>
            <Controller
              control={form.control}
              name="isMonitorDaily"
              render={({ field: { onChange, value } }) => (
                <Switch value={!!value} onValueChange={onChange} />
              )}
            />
          </View>
        </FormSection>

        <FormSection title="Detalhes Técnicos e Físicos">
          {renderInputs(['height', 'weight', 'dominantFoot'])}
        </FormSection>

        <FormSection title="Histórico Clínico">
          <Text style={{ color: colors.text }}>Exibição futura de Lesões, Dores e Clubes</Text>
        </FormSection>

        <View style={styles.buttonGroup}>
          <Button title="Cancelar" onPress={() => navigation.goBack()} color={colors.danger} />
          <Button title="Salvar" onPress={handleSubmit(onSubmit)} color={colors.primary} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 24,
  },
  backButton: {
    marginRight: 12,
    marginLeft:16
  },
});
