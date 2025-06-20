import { API_URL } from "@env";
import { apiFetch, publicFetch } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LoginResponse {
    token: string;
    refreshToken: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
    return await publicFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
}


