import { API_URL } from '@env';
import { deleteSession, getAccessToken, refreshSession } from './session-service';

async function logoutAndThrow(): Promise<never> {
  await deleteSession();
  throw new Error('Sessão expirada. Faça login novamente.');
}

export async function apiFetch<TResponse = any>(
    path: string,
    options: RequestInit = {},
    retry = true,
    forcedToken?: string | null
): Promise<TResponse> {
    const token = forcedToken ?? (await getAccessToken())

    const base = (API_URL ?? '').replace(/\/+$/, '')
    const endpoint = path.replace(/^\/+/, '')
    const cleanUrl = `${base}/${endpoint}`

    
    const isFormData = options.body instanceof FormData;

    const baseHeaders: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    };

    const body =
        !isFormData && options.body && typeof options.body === 'object'
            ? JSON.stringify(options.body)
            : options.body

    const nextOptions: RequestInit = { ...options, body }

    const finalHeaders = {
        ...baseHeaders,
        ...(options.headers && typeof options.headers === 'object' && !(options.headers instanceof Headers)
            ? (options.headers as Record<string, string>)
            : {}),
    };

    const response = await fetch(cleanUrl, {
        ...nextOptions,
        body,
        headers: finalHeaders,
    });


    if (response.status === 401 && retry) {
    const newToken = await refreshSession()
    if (newToken) return apiFetch<TResponse>(path, nextOptions, false, newToken)
    return await logoutAndThrow()
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
    const base = (API_URL ?? '').replace(/\/+$/, '')
    const endpoint = path.replace(/^\/+/, '')
    const cleanUrl = `${base}/${endpoint}`

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
