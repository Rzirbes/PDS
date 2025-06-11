import useSWR from 'swr'
import {
    mockAthletes,
    mockCoaches,
    mockCities,
    mockMonitory,
} from '../mock'

type FetcherKey = 'athletes' | 'coaches' | 'cities' | 'monitory'

const fetcher = (key: FetcherKey) => {
    switch (key) {
        case 'athletes':
            return Promise.resolve(mockAthletes)
        case 'coaches':
            return Promise.resolve(mockCoaches)
        case 'cities':
            return Promise.resolve(mockCities)
        case 'monitory':
            return Promise.resolve(mockMonitory)
        default:
            return Promise.reject(new Error('Not found'))
    }
}

export const useAthletes = () => useSWR('athletes', fetcher as (key: string) => Promise<any>)
export const useCoaches = () => useSWR('coaches', fetcher as (key: string) => Promise<any>)
export const useCities = () => useSWR('cities', fetcher as (key: string) => Promise<any>)
export const useMonitory = () => useSWR('monitory', fetcher as (key: string) => Promise<any>)