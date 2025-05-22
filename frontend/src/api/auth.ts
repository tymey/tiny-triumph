import api from './index';

interface TokenResponse {
    access: string;
    refresh: string;
}

interface Credentials {
    username: string;
    password: string
}

// Sign up a new user
export function register(username: string, password: string) {
    return api.post('/auth/register/', { username, password });
}

// Obtain JWT pair
export function login({ username, password }: Credentials) {
    return api.post<TokenResponse>('/auth/login/', { username, password });
}

// Refresh access token
export function refreshToken(refresh: string) {
    return api.post<{ access: string }>('/auth/token/refresh/', { refresh })
}