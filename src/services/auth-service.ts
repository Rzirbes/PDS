import { API_URL } from "@env";
import { apiFetch } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function login(email: string, password: string) {
    return apiFetch<{ token: string; refreshToken: string }>('auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}


