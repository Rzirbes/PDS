import { useEffect, useState } from 'react';
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
import MultiSelect from '../../components/ui/multi-select';
import { DominantFoot, dominantFootLabel, FootballPosition, footballPositionLabels } from '../../enums/athelte';
import SingleSelect from '../../components/ui/single-select';
import { useCitiesByState, useCountries, useStatesByCountry } from '../../hooks/use-countries';
import { useClubsByCity } from '../../hooks/use-club';
import { mutate } from 'swr';
import LocationPickerGroup from '../../components/ui/location-picker-group';

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
  clubs: z.array(z.string()).optional(),
});


interface Location {
  countryId: string | null;
  stateId: string | null;
  cityId: string | null;
}
type FormData = z.infer<typeof schema>;

export default function EditAthleteScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'EditAthlete'>>();
  const { athleteId } = route.params;

  const [location, setLocation] = useState<Location>({ countryId: null, stateId: null, cityId: null });


  const [selectedClubCountryId, setSelectedClubCountryId] = useState<string | undefined>(undefined);
  const [selectedClubStateId, setSelectedClubStateId] = useState<string | undefined>(undefined);
  const [selectedClubCityId, setSelectedClubCityId] = useState<string | undefined>(undefined);




  const { data: countries } = useCountries();

  const { data: clubStates } = useStatesByCountry(selectedClubCountryId);
  const { data: clubCities } = useCitiesByState(selectedClubStateId);
  const { data: clubs } = useClubsByCity(selectedClubCityId);


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

        clubs: athlete.clubs?.map((club) => club.clubId) ?? [],
      });

      setLocation({
        countryId: athlete.address?.countryId ?? null,
        stateId: athlete.address?.stateId ?? null,
        cityId: athlete.address?.cityId ?? null,
      });

      if (athlete.clubs && athlete.clubs.length > 0) {
        const firstClub = athlete.clubs[0];
        setSelectedClubCountryId(firstClub.countryId);
        setSelectedClubStateId(firstClub.stateId);
        setSelectedClubCityId(firstClub.cityId);
      }
    }
  }, [athlete, reset]);




  useEffect(() => {
    const firstClub = athlete?.clubs?.[0];
    if (firstClub?.stateId && clubStates) {
      const foundState = clubStates.find(s => s.id === firstClub.stateId);
      if (foundState) setSelectedClubStateId(firstClub.stateId);
    }
  }, [athlete, clubStates]);

  useEffect(() => {
    const firstClub = athlete?.clubs?.[0];
    if (firstClub?.cityId && clubCities) {
      const foundCity = clubCities.find(c => c.id === firstClub.cityId);
      if (foundCity) setSelectedClubCityId(firstClub.cityId);
    }
  }, [athlete, clubCities]);

  async function onSubmit(values: FormData) {
    const addressPayload = {
      street: values.street,
      neighborhood: values.neighborhood,
      buildingNumber: values.number,
      complement: values.complement,
      zipCode: values.zipCode,
      country: location.countryId,
      state: location.stateId,
      city: location.cityId,
    };

    const payloadToSend = {
      ...values,
      address: addressPayload,
    };

    try {
      await updateAthleteCache(payloadToSend);
      showMessage({ message: 'Sucesso', description: 'Atleta atualizado com sucesso!', type: 'success' });
      navigation.goBack();
    } catch {
      showMessage({ message: 'Erro', description: 'Falha ao atualizar atleta.', type: 'danger' });
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
          {renderInputs(['height', 'weight', 'bestSkill', 'worstSkill', 'goal', 'description'])}
          <Controller
            control={form.control}
            name="dominantFoot"
            render={({ field: { value, onChange } }) => (
              <SingleSelect
                label="Pé dominante"
                selectedValue={value}
                onChange={onChange}
                options={Object.values(DominantFoot).map((foot) => ({
                  value: foot,
                  label: dominantFootLabel[foot],
                }))}
              />
            )}
          />
          <Controller
            control={form.control}
            name="positions"
            render={({ field: { value, onChange } }) => (
              <MultiSelect
                label="Posições em campo"
                selectedValues={value ?? []}
                onChange={onChange}
                options={Object.values(FootballPosition).map((position) => ({
                  label: footballPositionLabels[position],
                  value: position,
                }))}
              />
            )}
          />
        </FormSection>

        <FormSection title="Endereço do Atleta">
          {renderInputs(['country', 'state', 'city', 'zipCode', 'street', 'number', 'neighborhood', 'complement'])}
        </FormSection>

        <FormSection title="Clubes do Atleta">
          {athlete.clubs && athlete.clubs.length > 0 ? (
            athlete.clubs.map((club) => (
              <View
                key={club.clubId}
                style={{
                  marginBottom: 12,
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: colors.surface,
                }}
              >
                <Text style={{ color: colors.text, fontWeight: 'bold' }}>{club.name}</Text>
                <Text style={{ color: colors.text }}>
                  Início: {new Date(club.startDate).toLocaleDateString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ color: colors.text }}>Nenhum clube cadastrado.</Text>
          )}
        </FormSection>


        <FormSection title="Lesões">
          {athlete.injuries && athlete.injuries.length > 0 ? (
            athlete.injuries.map((injury) => (
              <View
                key={injury.uuid}
                style={{
                  marginBottom: 12,
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: colors.surface,
                }}
              >
                <Text style={{ color: colors.text, fontWeight: 'bold' }}>{injury.description}</Text>
                <Text style={{ color: colors.text }}>Região: {injury.bodyRegion}</Text>
                <Text style={{ color: colors.text }}>Grau: {injury.degree}</Text>
                <Text style={{ color: colors.text }}>Data: {new Date(injury.date).toLocaleDateString()}</Text>
              </View>
            ))
          ) : (
            <Text style={{ color: colors.text }}>Nenhuma lesão cadastrada.</Text>
          )}
        </FormSection>

        <FormSection title="Dores">
          {athlete.pains && athlete.pains.length > 0 ? (
            athlete.pains.map((pain) => (
              <View
                key={pain.uuid}
                style={{
                  marginBottom: 12,
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: colors.surface,
                }}
              >
                <Text style={{ color: colors.text, fontWeight: 'bold' }}>Região: {pain.bodyRegion}</Text>
                <Text style={{ color: colors.text }}>Intensidade: {pain.intensity}</Text>
                <Text style={{ color: colors.text }}>Data: {new Date(pain.date).toLocaleDateString()}</Text>
              </View>
            ))
          ) : (
            <Text style={{ color: colors.text }}>Nenhuma dor cadastrada.</Text>
          )}
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
function useAllClubs(): { data: any; isLoading: any; } {
  throw new Error('Function not implemented.');
}

