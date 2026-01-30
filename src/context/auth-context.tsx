import React, { createContext, useContext, useEffect, useState } from 'react';
import { deleteSession, getAccessToken, getKeepConnected } from '../services/session-service';

interface AuthContextType {
    token: string | null;
    isLoading: boolean;
    setToken: (token: string | null) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadToken() {
            const keepConnected = await getKeepConnected();
            if (keepConnected) {
            const savedToken = await getAccessToken();
            setToken(savedToken);
            }
            setIsLoading(false);
        }
        loadToken();
        }, []);

        async function logout() {
        await deleteSession();
        setToken(null);
        }

    return (
        <AuthContext.Provider value={{ token, isLoading, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth precisa estar dentro de um AuthProvider');
    }
    return context;
};
