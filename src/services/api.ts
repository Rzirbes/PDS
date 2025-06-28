import { API_URL } from '@env';
import { getAccessToken, refreshSession } from './session-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function logoutAndThrow(): Promise<never> {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    throw new Error('Sessão expirada. Faça login novamente.');
}

export async function apiFetch<TResponse = any>(
    path: string,
    options: RequestInit = {},
    retry = true
): Promise<TResponse> {
    let token = await getAccessToken();

    const cleanUrl = `${API_URL}${path}`.replace(/([^:]\/)\/+/g, '$1');
    const isFormData = options.body instanceof FormData;

    const baseHeaders: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    };

    const finalHeaders = {
        ...baseHeaders,
        ...(options.headers && typeof options.headers === 'object' && !(options.headers instanceof Headers)
            ? (options.headers as Record<string, string>)
            : {}),
    };

    const response = await fetch(cleanUrl, {
        ...options,
        headers: finalHeaders,
    });

    console.log('API_URL:', API_URL);
    console.log('Chamada final:', cleanUrl);
    console.log('Headers:', finalHeaders);

    if (response.status === 401 && retry) {
        console.warn('Token expirado. Tentando refresh...');
        const newToken = await refreshSession();

        if (newToken) {
            return apiFetch<TResponse>(path, options, false);
        } else {
            console.warn('Refresh falhou. Fazendo logout.');
            return await logoutAndThrow();
        }
    }

    const rawText = await response.clone().text();
    console.log('Resposta bruta da API:', rawText);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
        console.error('Erro no cadastro:', response.status, rawText);

        let errorMessage = 'Erro desconhecido';
        try {
            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                const errorBody = JSON.parse(rawText);
                errorMessage = errorBody?.message || errorMessage;
            }
        } catch (parseError) {
            console.warn('Erro ao tentar parsear resposta de erro da API:', parseError);
        }

        throw new Error(`Erro ${response.status}: ${errorMessage}`);
    }

    if (response.status === 204) {
        return {} as TResponse;
    }

    const json = await response.json();
    console.log('JSON parseado:', json);
    return json;
}

export async function publicFetch<TResponse = any>(
    path: string,
    options: RequestInit = {}
): Promise<TResponse> {
    const cleanUrl = `${API_URL}${path}`.replace(/([^:]\/)\/+/g, '$1');

    const response = await fetch(cleanUrl, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        },
    });

    console.log('Public Fetch - URL:', cleanUrl);

    if (!response.ok) {
        let errorMessage = 'Erro desconhecido';
        try {
            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                const errorBody = await response.json();
                errorMessage = errorBody?.message || errorMessage;
            }
        } catch (parseError) {
            console.warn('Erro ao parsear erro da API:', parseError);
        }
        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return {} as TResponse;
    }

    return response.json();
}
