import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/theme-context';
import { useCountries, useStatesByCountry, useCitiesByState } from '../../hooks/use-countries';
import { ModalPicker } from './modal-picker';

interface Props {
    defaultCountryId?: string;
    defaultStateId?: string;
    defaultCityId?: string;
    onLocationChange: (countryId: string | null, stateId: string | null, cityId: string | null) => void;
}


export default function LocationPickerGroup({
    defaultCountryId,
    defaultStateId,
    defaultCityId,
    onLocationChange,
}: Props) {
    const { colors } = useTheme();

    const { data: countries = [] } = useCountries();

    const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
    const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
    const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

    const { data: states = [], isLoading: isLoadingStates } = useStatesByCountry(selectedCountryId);
    const { data: cities = [], isLoading: isLoadingCities } = useCitiesByState(selectedStateId);

    const [openModal, setOpenModal] = useState<'country' | 'state' | 'city' | null>(null);

    // Aplicar os valores default iniciais
    useEffect(() => {
        if (countries.length > 0 && defaultCountryId) {
            setSelectedCountryId(defaultCountryId);
        }
    }, [countries, defaultCountryId]);

    useEffect(() => {
        if (states.length > 0 && defaultStateId) {
            setSelectedStateId(defaultStateId);
        }
    }, [states, defaultStateId]);

    useEffect(() => {
        if (cities.length > 0 && defaultCityId) {
            setSelectedCityId(defaultCityId);
        }
    }, [cities, defaultCityId]);

    // Sempre que algum valor mudar, avisa o pai
    useEffect(() => {
        onLocationChange(selectedCountryId, selectedStateId, selectedCityId);
    }, [selectedCountryId, selectedStateId, selectedCityId]);

    // Reset de dependências em cascata
    useEffect(() => {
        setSelectedStateId(null);
        setSelectedCityId(null);
    }, [selectedCountryId]);

    useEffect(() => {
        setSelectedCityId(null);
    }, [selectedStateId]);

    function getLabel(list: { id: string; name: string }[], id: string | null) {
        return list.find(item => item.id === id)?.name || '';
    }

    return (
        <View>
            {/* País */}
            <Text style={{ color: colors.text, marginBottom: 4 }}>País</Text>
            <TouchableOpacity onPress={() => setOpenModal('country')} style={{ borderWidth: 1, padding: 8, borderRadius: 6, borderColor: colors.muted }}>
                <Text style={{ color: colors.text }}>
                    {getLabel(countries, selectedCountryId) || 'Selecione um país'}
                </Text>
            </TouchableOpacity>

            {/* Estado */}
            <Text style={{ color: colors.text, marginTop: 16, marginBottom: 4 }}>Estado</Text>
            <TouchableOpacity
                onPress={() => selectedCountryId && setOpenModal('state')}
                disabled={!selectedCountryId}
                style={{ borderWidth: 1, padding: 8, borderRadius: 6, borderColor: colors.muted }}
            >
                <Text style={{ color: colors.text }}>
                    {isLoadingStates
                        ? 'Carregando estados...'
                        : getLabel(states, selectedStateId) || 'Selecione um estado'}
                </Text>
            </TouchableOpacity>

            {/* Cidade */}
            <Text style={{ color: colors.text, marginTop: 16, marginBottom: 4 }}>Cidade</Text>
            <TouchableOpacity
                onPress={() => selectedStateId && setOpenModal('city')}
                disabled={!selectedStateId}
                style={{ borderWidth: 1, padding: 8, borderRadius: 6, borderColor: colors.muted }}
            >
                <Text style={{ color: colors.text }}>
                    {isLoadingCities
                        ? 'Carregando cidades...'
                        : getLabel(cities, selectedCityId) || 'Selecione uma cidade'}
                </Text>
            </TouchableOpacity>

            {/* Modais */}
            {openModal === 'country' && (
                <ModalPicker
                    selectedValue={""}
                    visible
                    title="Selecionar País"
                    options={countries.map(c => ({ label: c.name, value: c.id }))}
                    onSelect={(value) => {
                        setSelectedCountryId(value);
                        setOpenModal(null);
                    }}
                    onClose={() => setOpenModal(null)}
                />
            )}

            {openModal === 'state' && (
                <ModalPicker
                    selectedValue={""}
                    visible
                    title="Selecionar Estado"
                    options={states.map(s => ({ label: s.name, value: s.id }))}
                    onSelect={(value) => {
                        setSelectedStateId(value);
                        setOpenModal(null);
                    }}
                    onClose={() => setOpenModal(null)}
                />
            )}

            {openModal === 'city' && (
                <ModalPicker
                    selectedValue={""}
                    visible
                    title="Selecionar Cidade"
                    options={cities.map(c => ({ label: c.name, value: c.id }))}
                    onSelect={(value) => {
                        setSelectedCityId(value);
                        setOpenModal(null);
                    }}
                    onClose={() => setOpenModal(null)}
                />
            )}
        </View>
    );
}
