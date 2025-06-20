import useSWR from 'swr';
import { getCountries, getStates, getCities, Country, State, City } from '../services/location-service';


export function useCountries() {
    return useSWR<Country[]>('countries', getCountries);
}

export function useStatesByCountry(countryId: string | null) {
    return useSWR<State[]>(
        countryId ? `states-${countryId}` : null,
        () => getStates(countryId!),
        { revalidateOnFocus: false }
    );
}

export function useCitiesByState(stateId: string | null) {
    return useSWR<City[]>(
        stateId ? `cities-${stateId}` : null,
        () => getCities(stateId!),
        { revalidateOnFocus: false }
    );
}