import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const KEEP_CONNECTED_KEY = 'keepConnected';

export async function saveSession(accessToken: string, refreshToken: string, keepConnected: boolean) {
  try {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    await AsyncStorage.setItem(KEEP_CONNECTED_KEY, JSON.stringify(keepConnected));
  } catch (error) {
    console.error('Erro ao salvar sessão:', error);
  }
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
  try {
    const value = await AsyncStorage.getItem(KEEP_CONNECTED_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Erro ao buscar keepConnected:', error);
    return false;
  }
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
  const refreshToken = await getRefreshToken();
  const keepConnected = await getKeepConnected();

  if (!refreshToken) {
    console.warn('Refresh token não encontrado.');
    return null;
  }

  try {
    const response = await fetch(`${API_URL}auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.warn('Falha ao fazer refresh, status:', response.status);
      return null;
    }

    let data: { token: string; refreshToken: string };

    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Erro ao parsear resposta do refresh:', jsonError);
      return null;
    }

    await saveSession(data.token, data.refreshToken, keepConnected);

    console.log('Token de sessão renovado com sucesso.');
    return data.token;
  } catch (error) {
    console.error('Erro ao fazer refresh do token:', error);
    return null;
  }
}
