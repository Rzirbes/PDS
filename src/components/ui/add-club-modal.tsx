import { useForm, Controller } from 'react-hook-form';
import { Modal, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/theme-context';
import LocationSelect from './location-select';
import { useState } from 'react';
import { useClubsByCity, useCreateClub } from '../../hooks/use-club';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ModalPicker } from './modal-picker';
import { Plus, X } from 'lucide-react-native';

interface CreateClubFormData {
    name: string;
    clubId: string;
    country: string;
    state: string;
    city: string;
    startDate: string;
}

export function AddClubModal({
    visible,
    onClose,
    onSave,
}: {
    visible: boolean;
    onClose: () => void;
    onSave: (club: any) => void;
}) {
    const { colors } = useTheme();
    const {
        control,
        handleSubmit: formHandleSubmit,
        reset,
        setValue,
        watch,
    } = useForm<CreateClubFormData>();

    const cityId = watch('city');
    console.log('cityId:', cityId);
    const { data: clubs = [] } = useClubsByCity(cityId);
    const [clubModalVisible, setClubModalVisible] = useState(false);
    const { submit } = useCreateClub();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [creatingNewClub, setCreatingNewClub] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(new Date());

    const onSubmit = async (data: CreateClubFormData) => {
        setLoading(true);
        setError(null);

        try {
            if (creatingNewClub) {
                const result = await submit({
                    name: data.name,
                    countryId: data.country,
                    stateId: data.state,
                    cityId: data.city,
                });

                if (result) {
                    onSave({
                        clubId: result.id,
                        name: data.name,
                        countryId: data.country,
                        stateId: data.state,
                        cityId: data.city,
                        startDate: data.startDate
                    });
                }
            } else {
                const selectedClub = clubs.find(c => c.id === data.clubId);
                if (selectedClub) {
                    onSave({
                        ...selectedClub,
                        startDate: data.startDate,
                    });
                }
            }

            reset();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={{ flex: 1, backgroundColor: '#000000aa', justifyContent: 'center', padding: 24 }}>
                <View style={{ backgroundColor: colors.surface, padding: 24, borderRadius: 12 }}>
                    <Text style={{ color: colors.text, fontSize: 16, marginBottom: 12 }}>Nome do clube</Text>

                    <LocationSelect
                        control={control}
                        watch={watch}
                        setValue={setValue}
                        location={{
                            countryId: watch('country'),
                            stateId: watch('state'),
                            cityId: watch('city'),
                        }}
                        setLocation={() => { }}
                    />

                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ color: colors.text, marginBottom: 4 }}>Clube</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {creatingNewClub ? (
                                <Controller
                                    control={control}
                                    name="name"
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            placeholder="Digite o nome do clube"
                                            placeholderTextColor={colors.muted}
                                            value={value}
                                            onChangeText={onChange}
                                            style={{
                                                flex: 1,
                                                borderBottomWidth: 1,
                                                borderBottomColor: colors.border,
                                                color: colors.text,
                                                paddingVertical: 4,
                                            }}
                                        />
                                    )}
                                />
                            ) : (
                                <Controller
                                    control={control}
                                    name="clubId"
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <TouchableOpacity
                                                onPress={() => setClubModalVisible(true)}
                                                style={{
                                                    flex: 1,
                                                    borderWidth: 1,
                                                    borderColor: colors.muted,
                                                    borderRadius: 8,
                                                    padding: 12,
                                                    backgroundColor: colors.background,
                                                }}
                                            >
                                                <Text style={{ color: colors.text }}>
                                                    {clubs.find((c) => c.id === value)?.name || 'Selecione um clube'}
                                                </Text>
                                            </TouchableOpacity>

                                            <ModalPicker
                                                visible={clubModalVisible}
                                                title="Selecione um clube"
                                                options={clubs.map(({ id, name }) => ({ label: name, value: id }))}
                                                selectedValue={value}
                                                onSelect={(val) => onChange(val)}
                                                onClose={() => setClubModalVisible(false)}
                                            />
                                        </>
                                    )}
                                />
                            )}

                            <TouchableOpacity
                                onPress={() => {
                                    setCreatingNewClub(prev => {
                                        const newValue = !prev;
                                        if (newValue) {
                                            setValue('clubId', '');
                                        } else {
                                            setValue('name', '');
                                        }
                                        return newValue;
                                    });
                                }}
                                style={{
                                    marginLeft: 8,
                                    height: 46,
                                    width: 48,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: colors.muted,
                                    backgroundColor: colors.background,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {creatingNewClub ? (
                                    <X size={20} color={colors.text} />
                                ) : (
                                    <Plus size={20} color={colors.text} />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Controller
                        control={control}
                        name="startDate"
                        defaultValue={new Date().toISOString()}
                        render={({ field: { onChange, value } }) => (
                            <>
                                <TouchableOpacity
                                    onPress={() => {
                                        setTempDate(new Date(value)); // carrega valor atual no seletor
                                        setShowDatePicker(true);
                                    }}
                                    style={{
                                        marginBottom: 16,
                                        padding: 12,
                                        borderRadius: 8,
                                        borderWidth: 1,
                                        borderColor: colors.muted,
                                        backgroundColor: colors.background,
                                    }}
                                >
                                    <Text style={{ color: colors.text }}>
                                        Início: {new Date(value).toLocaleDateString()}
                                    </Text>
                                </TouchableOpacity>

                                {/* Android direto */}
                                {showDatePicker && Platform.OS === 'android' && (
                                    <DateTimePicker
                                        value={new Date(value)}
                                        mode="date"
                                        display="default"
                                        onChange={(_, selectedDate) => {
                                            setShowDatePicker(false);
                                            if (selectedDate) {
                                                onChange(selectedDate.toISOString());
                                            }
                                        }}
                                    />
                                )}

                                {/* iOS com modal custom */}
                                {Platform.OS === 'ios' && showDatePicker && (
                                    <Modal
                                        transparent
                                        animationType="slide"
                                        visible={showDatePicker}
                                        onRequestClose={() => setShowDatePicker(false)}
                                    >
                                        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000055' }}>
                                            <View
                                                style={{
                                                    backgroundColor: colors.surface,
                                                    borderTopLeftRadius: 12,
                                                    borderTopRightRadius: 12,
                                                    paddingTop: 16,
                                                    paddingHorizontal: 24,
                                                    paddingBottom: 32,
                                                }}
                                            >
                                                <Text style={{ color: colors.text, marginBottom: 12 }}>Selecione a data</Text>

                                                <DateTimePicker
                                                    value={tempDate}
                                                    mode="date"
                                                    display="spinner"
                                                    onChange={(_, selectedDate) => {
                                                        if (selectedDate) {
                                                            setTempDate(selectedDate); // atualiza temp
                                                        }
                                                    }}
                                                    style={{ width: '100%' }}
                                                />

                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                                                    <TouchableOpacity
                                                        onPress={() => setShowDatePicker(false)}
                                                        style={{
                                                            padding: 12,
                                                            borderRadius: 8,
                                                            backgroundColor: colors.danger,
                                                            flex: 1,
                                                            marginRight: 8,
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancelar</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            onChange(tempDate.toISOString());
                                                            setShowDatePicker(false);
                                                        }}
                                                        style={{
                                                            padding: 12,
                                                            borderRadius: 8,
                                                            backgroundColor: colors.primary,
                                                            flex: 1,
                                                            marginLeft: 8,
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Confirmar</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </Modal>
                                )}
                            </>
                        )}
                    />

                    <TouchableOpacity
                        onPress={formHandleSubmit(onSubmit)}
                        disabled={loading}
                        style={{
                            backgroundColor: colors.primary,
                            padding: 12,
                            borderRadius: 8,
                            marginTop: 16,
                            alignItems: 'center',
                            opacity: loading ? 0.6 : 1,
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Salvar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onClose}
                        style={{
                            backgroundColor: colors.danger,
                            padding: 12,
                            borderRadius: 8,
                            marginTop: 8,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
