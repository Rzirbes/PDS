import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useCitiesByState, useCountries, useStatesByCountry } from '../../hooks/use-countries';
import { ModalPicker } from './modal-picker';
import { useTheme } from '../../context/theme-context';

interface Props {
    selectedCountryId: string | null;
    selectedStateId: string | null;
    selectedCityId: string | null;
    onCountryChange: (id: string | null) => void;
    onStateChange: (id: string | null) => void;
    onCityChange: (id: string | null) => void;
}

export default function LocationPickerGroup({
    selectedCountryId,
    selectedStateId,
    selectedCityId,
    onCountryChange,
    onStateChange,
    onCityChange,
}: Props) {
    const { colors } = useTheme();

    const { data: countries = [] } = useCountries();
    const { data: states = [], isLoading: isLoadingStates } = useStatesByCountry(selectedCountryId);
    const { data: cities = [], isLoading: isLoadingCities } = useCitiesByState(selectedStateId);


    const [openModal, setOpenModal] = useState<'country' | 'state' | 'city' | null>(null);

    useEffect(() => {
        onStateChange(null);
        onCityChange(null);
    }, [selectedCountryId]);

    useEffect(() => {
        onCityChange(null);
    }, [selectedStateId]);

    function getLabel(list: { id: string; name: string }[] | undefined, id: string | null) {
        if (!list || !id) return '';
        return list.find((item) => item.id === id)?.name || '';
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
                style={{ borderWidth: 1, padding: 8, borderRadius: 6, borderColor: colors.muted }}
                disabled={!selectedCountryId}
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
                style={{ borderWidth: 1, padding: 8, borderRadius: 6, borderColor: colors.muted }}
                disabled={!selectedStateId}
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
                    visible
                    title="Selecionar País"
                    options={countries.map((c) => ({ label: c.name, value: c.id }))}
                    onSelect={(value) => onCountryChange(value)}
                    onClose={() => setOpenModal(null)}
                />
            )}

            {openModal === 'state' && (
                <ModalPicker
                    visible
                    title="Selecionar Estado"
                    options={states.map((s) => ({ label: s.name, value: s.id }))}
                    onSelect={(value) => onStateChange(value)}
                    onClose={() => setOpenModal(null)}
                />
            )}

            {openModal === 'city' && (
                <ModalPicker
                    visible
                    title="Selecionar Cidade"
                    options={cities.map((c) => ({ label: c.name, value: c.id }))}
                    onSelect={(value) => onCityChange(value)}
                    onClose={() => setOpenModal(null)}
                />
            )}
        </View>
    );
}
