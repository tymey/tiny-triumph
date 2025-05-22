import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { login, refreshToken } from '../api/auth';

type AuthContextType = {
    user: string | null;
    login: (u: string, p: string) => Promise<void>;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => {},
    logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<string | null>(null);

    // On mount, check for tokens in localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const refresh = localStorage.getItem('refresh_token');
        if (savedUser && refresh) {
            setUser(savedUser);
            // Optionally refresh the access token
            refreshToken(refresh)
                .then(res => {
                    localStorage.setItem('access_token', res.data.access);
                })
                .catch(() => {
                    // Refresh failed, force logout
                    logout();
                });
        }
    }, []);

    const doLogin =  async (username: string, password: string) => {
        const res = await login({ username, password });
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        localStorage.setItem('user', username);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login: doLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
}