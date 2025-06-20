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
import { ChevronLeft } from 'lucide-react-native';
import { updateAthlete } from '../../services/athlete-service';

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
  description: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  neighborhood: z.string().optional(),
  complement: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditAthleteScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'EditAthlete'>>();
  const { athleteId } = route.params;

  const { athlete, isLoading, updateAthlete: updateAthleteCache } = useAthleteById(athleteId);

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
      description: '',
      country: '',
      state: '',
      city: '',
      zipCode: '',
      street: '',
      number: '',
      neighborhood: '',
      complement: '',
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
        birthday: athlete.birthday ? new Date(athlete.birthday).toISOString().split('T')[0] : '',
        height: athlete.height !== undefined ? String(athlete.height) : '',
        weight: athlete.weight !== undefined ? String(athlete.weight) : '',
        isEnabled: athlete.isEnabled ?? false,
        isMonitorDaily: athlete.isMonitorDaily ?? false,
        bestSkill: athlete.bestSkill ?? '',
        worstSkill: athlete.worstSkill ?? '',
        goal: athlete.goal ?? '',
        dominantFoot: athlete.dominantFoot ?? '',
        positions: athlete.positions ?? [],
        description: athlete.observation ?? '',

        street: athlete.address?.street ?? '',
        neighborhood: athlete.address?.neighborhood ?? '',
        number: athlete.address?.buildingNumber ?? '',
        complement: athlete.address?.complement ?? '',
        zipCode: athlete.address?.zipCode ?? '',
        city: athlete.address?.city ?? '',
        state: athlete.address?.state ?? '',
        country: athlete.address?.country ?? '',
      });
    }
  }, [athlete, reset]);

  async function onSubmit(values: FormData) {
    const addressPayload = {
      street: values.street,
      neighborhood: values.neighborhood,
      buildingNumber: values.number, // Aqui mapeia de volta
      complement: values.complement,
      zipCode: values.zipCode,
      city: values.city,
      state: values.state,
      country: values.country,
    };

    const payloadToSend = {
      ...values,
      address: addressPayload,
    };

    try {
      await updateAthleteCache(payloadToSend);
      showMessage({
        message: 'Sucesso',
        description: 'Atleta atualizado com sucesso!',
        type: 'success',
      });
      navigation.goBack();
    } catch {
      showMessage({
        message: 'Erro',
        description: 'Falha ao atualizar atleta.',
        type: 'danger',
      });
    }
  }

  function renderInputs(fields: string[]) {
    return fields.map((fieldName) => {
      const field = inputFields.find(f => f.name === fieldName);
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

  const inputFields = [
    { name: 'name', label: 'Nome', placeholder: 'Nome' },
    { name: 'email', label: 'Email', placeholder: 'Email' },
    { name: 'cpf', label: 'CPF', placeholder: 'CPF' },
    { name: 'phone', label: 'Telefone', placeholder: 'Telefone' },
    { name: 'birthday', label: 'Data de nascimento', placeholder: 'AAAA-MM-DD' },
    { name: 'height', label: 'Altura (em metros)', placeholder: 'Ex: 1.75' },
    { name: 'weight', label: 'Peso (kg)', placeholder: 'Ex: 70' },
    { name: 'bestSkill', label: 'Melhor Qualidade', placeholder: 'Ex: Visão de jogo' },
    { name: 'worstSkill', label: 'Maio Defeito', placeholder: 'Ex: Finalização' },
    { name: 'goal', label: 'Objetivo', placeholder: 'Ex: Melhorar força' },
    { name: 'dominantFoot', label: 'Pé dominante', placeholder: 'Ex: Direito / Esquerdo' },
    { name: 'description', label: 'Observações', placeholder: 'Observações sobre o atleta' },
    { name: 'country', label: 'País', placeholder: 'Ex: Brasil' },
    { name: 'state', label: 'Estado', placeholder: 'Ex: RS' },
    { name: 'city', label: 'Cidade', placeholder: 'Ex: Porto Alegre' },
    { name: 'zipCode', label: 'CEP', placeholder: 'Ex: 00000-000' },
    { name: 'street', label: 'Rua', placeholder: 'Ex: Rua das Flores' },
    { name: 'number', label: 'Número', placeholder: 'Ex: 123' },
    { name: 'neighborhood', label: 'Bairro', placeholder: 'Ex: Centro' },
    { name: 'complement', label: 'Complemento', placeholder: 'Ex: Apt 101' },
  ];

  if (isLoading || !athlete) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.text }}>Carregando atleta...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <ChevronLeft color={colors.primary} size={24} />
      </TouchableOpacity>
      <ScrollView style={styles.container}>

        <Text style={[styles.title, { color: colors.text }]}>Editar atleta</Text>

        <FormSection title="Dados Pessoais">
          {renderInputs(['name', 'email', 'cpf', 'phone', 'birthday'])}
        </FormSection>

        <FormSection title="Status">
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

        <FormSection title="Características">
          {renderInputs(['dominantFoot', 'positions', 'height', 'weight', 'bestSkill', 'worstSkill', 'goal', 'description'])}
        </FormSection>

        <FormSection title="Endereço do Atleta">
          {renderInputs(['country', 'state', 'city', 'zipCode', 'street', 'number', 'neighborhood', 'complement'])}
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
    marginTop: 12,
    marginLeft: 16,
  },
});
