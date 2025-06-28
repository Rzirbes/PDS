import useSWR, { mutate } from 'swr';
import { getCountries, getStates, getCities, Country, State, City } from '../services/location-service';
import { useEffect } from 'react';


export function useCountries() {
    console.log('Chamou useCountries');

    const swrResult = useSWR<Country[]>(
        'countries?all=true',
        getCountries,
        {
            revalidateOnMount: true,
            revalidateOnFocus: true,
            dedupingInterval: 0,
        }
    );
    useEffect(() => {
        mutate('countries?all=true');  // Força o refresh
    }, []);

    console.log('Resultado de countries:', swrResult.data);

    return swrResult;
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