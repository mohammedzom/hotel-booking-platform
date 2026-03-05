import apiClient from '../lib/apiClient';
import { useAuthStore } from '../store/authStore';
import type {
    AuthResponse,
    LoginRequest,
    ProfileResponse,
    RegisterRequest,
    UpdateProfileRequest,
    UserProfile,
} from '../types/auth.types';

// ── Helper: map AuthResponse → UserProfile (strips nested token) ──────────────
function toUserProfile(res: AuthResponse): UserProfile {
    return {
        id: res.id,
        email: res.email,
        firstName: res.firstName,
        lastName: res.lastName,
        phoneNumber: null, // AuthResponse doesn't include phoneNumber; fetch profile for it
        role: res.role,
        createdAt: res.createdAt,
    };
}

function profileResponseToUser(res: ProfileResponse): UserProfile {
    return {
        id: res.id,
        email: res.email,
        firstName: res.firstName,
        lastName: res.lastName,
        phoneNumber: res.phoneNumber,
        role: res.role,
        createdAt: res.createdAt,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth Service
// ─────────────────────────────────────────────────────────────────────────────

export const authService = {
    /**
     * Login — sets auth state in store automatically.
     * Returns the AuthResponse for any additional UI use.
     */
    async login(payload: LoginRequest): Promise<AuthResponse> {
        const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
        useAuthStore.getState().setAuth(toUserProfile(data), data.token.accessToken);
        return data;
    },

    /**
     * Register — sets auth state in store automatically.
     */
    async register(payload: RegisterRequest): Promise<AuthResponse> {
        const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
        useAuthStore.getState().setAuth(toUserProfile(data), data.token.accessToken);
        return data;
    },

    /**
     * Fetch full profile (includes phoneNumber).
     * Updates user in store.
     */
    async getProfile(): Promise<ProfileResponse> {
        const { data } = await apiClient.get<ProfileResponse>('/auth/profile');
        useAuthStore.getState().setUser(profileResponseToUser(data));
        return data;
    },

    /**
     * Update profile fields, updates user in store.
     */
    async updateProfile(payload: UpdateProfileRequest): Promise<ProfileResponse> {
        const { data } = await apiClient.put<ProfileResponse>('/auth/profile', payload);
        useAuthStore.getState().setUser(profileResponseToUser(data));
        return data;
    },

    /**
     * Logout current session. Clears auth state regardless of server response.
     */
    async logout(): Promise<void> {
        try {
            await apiClient.post('/auth/logout');
        } finally {
            useAuthStore.getState().clearAuth();
        }
    },

    /**
     * Manually trigger a token refresh (usually handled by interceptor).
     */
    async refresh(): Promise<string> {
        const { data } = await apiClient.post<{ accessToken: string }>('/auth/refresh');
        useAuthStore.getState().setToken(data.accessToken);
        return data.accessToken;
    },
};
