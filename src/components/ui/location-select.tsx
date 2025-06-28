import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Controller } from 'react-hook-form';
import { useCountries, useStatesByCountry, useCitiesByState } from '../../hooks/use-countries';
import { useTheme } from '../../context/theme-context';
import Picker from 'react-native-picker-select';
import { ModalPicker } from './modal-picker';

interface Props {
    location: {
        countryId: string | null;
        stateId: string | null;
        cityId: string | null;
    };
    setLocation: React.Dispatch<React.SetStateAction<{
        countryId: string | null;
        stateId: string | null;
        cityId: string | null;
    }>>;
    control: any;
    watch: any;
    setValue: any;
}

export default function LocationSelect({ control, watch, setValue, setLocation }: Props) {
    const { colors } = useTheme();

    const selectedCountry = watch('country');
    const selectedState = watch('state');

    const [countryModalVisible, setCountryModalVisible] = useState(false);
    const [stateModalVisible, setStateModalVisible] = useState(false);
    const [cityModalVisible, setCityModalVisible] = useState(false);

    const { data: countries = [] } = useCountries();
    const { data: states = [] } = useStatesByCountry(selectedCountry);
    const { data: cities = [] } = useCitiesByState(selectedState);

    useEffect(() => {
        if (!selectedCountry) {
            setValue('state', '');
            setValue('city', '');
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (!selectedState) {
            setValue('city', '');
        }
    }, [selectedState]);

    const themedTextStyle = useMemo(() => ({ color: colors.text, marginBottom: 4 }), [colors.text]);
    const fieldStyle = { marginBottom: 16 };

    return (
        <View style={{ gap: 12 }}>

            {/* País */}
            <View style={fieldStyle}>
                <Text style={themedTextStyle}>País</Text>
                <Controller
                    control={control}
                    name="country"
                    render={({ field: { value, onChange } }) => {
                        const selectedLabel = countries.find(c => c.id === value)?.name ?? 'Selecione o país...';
                        return (
                            <>
                                <TouchableOpacity
                                    style={{
                                        borderWidth: 1,
                                        borderColor: colors.muted,
                                        borderRadius: 8,
                                        padding: 12,
                                        backgroundColor: colors.background,
                                    }}
                                    onPress={() => setCountryModalVisible(true)}
                                >
                                    <Text style={{ color: colors.text }}>{selectedLabel}</Text>
                                </TouchableOpacity>

                                <ModalPicker
                                    visible={countryModalVisible}
                                    title="Selecione o país"
                                    options={countries.map(({ id, name }) => ({ label: name, value: id }))}
                                    selectedValue={value}
                                    onSelect={(val) => {
                                        onChange(val);
                                        setValue('state', '');
                                        setValue('city', '');
                                        setLocation(prev => ({ ...prev, countryId: val }));
                                    }}
                                    onClose={() => setCountryModalVisible(false)}
                                />
                            </>
                        );
                    }}
                />
            </View>

            {/* Estado */}
            <View style={fieldStyle}>
                <Text style={themedTextStyle}>Estado</Text>
                <Controller
                    control={control}
                    name="state"
                    render={({ field: { value, onChange } }) => {
                        const selectedLabel = states.find(s => s.id === value)?.name ?? 'Selecione o estado...';
                        return (
                            <>
                                <TouchableOpacity
                                    style={{
                                        borderWidth: 1,
                                        borderColor: colors.muted,
                                        borderRadius: 8,
                                        padding: 12,
                                        backgroundColor: colors.background,
                                    }}
                                    onPress={() => setStateModalVisible(true)}
                                >
                                    <Text style={{ color: colors.text }}>{selectedLabel}</Text>
                                </TouchableOpacity>

                                <ModalPicker
                                    visible={stateModalVisible}
                                    title="Selecione o estado"
                                    options={states.map(({ id, name }) => ({ label: name, value: id }))}
                                    selectedValue={value}
                                    onSelect={(val) => {
                                        onChange(val);
                                        setValue('city', '');
                                        setLocation(prev => ({ ...prev, stateId: val }));
                                    }}
                                    onClose={() => setStateModalVisible(false)}
                                />
                            </>
                        );
                    }}
                />
            </View>

            {/* Cidade */}
            <View style={fieldStyle}>
                <Text style={themedTextStyle}>Cidade</Text>
                <Controller
                    control={control}
                    name="city"
                    render={({ field: { value, onChange } }) => {
                        const selectedLabel = cities.find(c => c.id === value)?.name ?? 'Selecione a cidade...';
                        return (
                            <>
                                <TouchableOpacity
                                    style={{
                                        borderWidth: 1,
                                        borderColor: colors.muted,
                                        borderRadius: 8,
                                        padding: 12,
                                        backgroundColor: colors.background,
                                    }}
                                    onPress={() => setCityModalVisible(true)}
                                >
                                    <Text style={{ color: colors.text }}>{selectedLabel}</Text>
                                </TouchableOpacity>

                                <ModalPicker
                                    visible={cityModalVisible}
                                    title="Selecione a cidade"
                                    options={cities.map(({ id, name }) => ({ label: name, value: id }))}
                                    selectedValue={value}
                                    onSelect={(val) => {
                                        onChange(val);
                                        setLocation(prev => ({ ...prev, cityId: val }));
                                    }}
                                    onClose={() => setCityModalVisible(false)}
                                />
                            </>
                        );
                    }}
                />
            </View>
        </View>
    );
}