import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const KEEP_CONNECTED_KEY = 'keepConnected';

export async function saveSession(accessToken: string, refreshToken: string, keepConnected: boolean) {
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  await AsyncStorage.setItem(KEEP_CONNECTED_KEY, keepConnected ? '1' : '0')
}

export async function getAccessToken() {
  try {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Erro ao buscar accessToken:', error);
    return null;
  }
}

export async function getRefreshToken() {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Erro ao buscar refreshToken:', error);
    return null;
  }
}

export async function getKeepConnected() {
  const value = await AsyncStorage.getItem(KEEP_CONNECTED_KEY)
  return value === '1'
}

export async function deleteSession() {
  try {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    await AsyncStorage.removeItem(KEEP_CONNECTED_KEY);
  } catch (error) {
    console.error('Erro ao deletar sessão:', error);
  }
}

export async function refreshSession(): Promise<string | null> {
  const refreshToken = await getRefreshToken()
  const keepConnected = await getKeepConnected()

  if (!refreshToken) {
    console.warn('Refresh token não encontrado.')
    return null
  }

  const base = (API_URL ?? '').replace(/\/+$/, '')
  const url = `${base}/auth/refresh-token`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.ok) {
    console.warn('Falha ao fazer refresh, status:', response.status)
    return null
  }

  const data = (await response.json()) as { token: string }

  await saveSession(data.token, refreshToken, keepConnected)

  return data.token
}


