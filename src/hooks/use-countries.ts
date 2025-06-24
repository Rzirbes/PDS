import useSWR from 'swr';
import { getCountries, getStates, getCities, Country, State, City } from '../services/location-service';


export function useCountries() {
    console.log('Chamou useCountries');
    return useSWR<Country[]>(
        'countries',
        getCountries,
        {
            revalidateOnMount: true,
            revalidateOnFocus: true,
            dedupingInterval: 0,
        }
    );
}

export function useStatesByCountry(countryId: string | null | undefined) {
    return useSWR<State[]>(
        countryId ? `states-${countryId}` : null,
        () => getStates(countryId!),
        {
            revalidateOnFocus: false,
            revalidateOnMount: true,
        }
    );
}

export function useCitiesByState(stateId: string | null | undefined) {
    return useSWR<City[]>(
        stateId ? `cities-${stateId}` : null,
        () => getCities(stateId!),
        { revalidateOnFocus: false }
    );
}