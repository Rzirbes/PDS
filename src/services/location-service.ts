import { apiFetch } from './api';

export interface Country {
    id: string;  // UUID
    name: string;
}

export interface State {
    id: string;  // UUID
    name: string;
    countryId: string;
}

export interface City {
    id: string;  // UUID
    name: string;
    stateId: string;
}

export async function getCountries(): Promise<Country[]> {
    const res = await apiFetch<{ countries: { value: string; label: string }[] }>('countries?all=true');
    console.log('resposta crua do getCountries:', res);
    return res.countries.map((item) => ({
        id: item.value,
        name: item.label,
    }));
}

export async function getStates(countryId: string): Promise<State[]> {
    const res = await apiFetch<{ states: { value: string; label: string }[] }>(`states?countryId=${countryId}`);
    console.log('resposta crua do getStates:', res);
    return res.states.map((item) => ({
        id: item.value,
        name: item.label,
        countryId: countryId,
    }));
}

export async function getCities(stateId: string): Promise<City[]> {
    const res = await apiFetch<{ cities: { value: string; label: string }[] }>(`cities?state=${stateId}`);
    console.log('resposta crua do getCities:', res);
    return res.cities.map((item) => ({
        id: item.value,
        name: item.label,
        stateId: stateId,
    }));
}