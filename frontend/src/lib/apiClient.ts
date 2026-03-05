import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '../store/authStore';
import type { TokenResponse } from '../types/auth.types';

// ─────────────────────────────────────────────────────────────────────────────
// Base Axios instance
// ─────────────────────────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1',
  withCredentials: true, // ← sends the HttpOnly refresh-token cookie automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// REQUEST INTERCEPTOR — inject Bearer token
// ─────────────────────────────────────────────────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE INTERCEPTOR — Silent Refresh on 401
// ─────────────────────────────────────────────────────────────────────────────

// Tracks whether a refresh is already in-flight to avoid concurrent calls
let isRefreshing = false;

// Queue of requests waiting for the token to be renewed
type QueueItem = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
};
let failedQueue: QueueItem[] = [];

/**
 * Flushes all queued requests after a refresh attempt.
 * If refresh succeeded, resolves them with the new token.
 * If it failed, rejects them all.
 */
function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  // Pass through successful responses unchanged
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Only intercept 401s that haven't been retried yet
    // Don't intercept 401s from the refresh endpoint itself (avoid infinite loop)
    const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh');
    const is401 = error.response?.status === 401;

    if (!is401 || originalRequest._retry || isRefreshEndpoint) {
      return Promise.reject(error);
    }

    // If a refresh is already in-flight, queue this request until it finishes
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        if (originalRequest.headers) {
          (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${token}`;
        }
        return apiClient(originalRequest);
      }).catch((err) => Promise.reject(err));
    }

    // Mark this request as already retried to prevent a second loop
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // ── Attempt silent token refresh ──────────────────────────────────────
      const { data } = await apiClient.post<TokenResponse>('/auth/refresh');
      const newToken = data.accessToken;

      // Save new token to the store
      useAuthStore.getState().setToken(newToken);

      // Flush the queue — let all waiting requests proceed with the new token
      processQueue(null, newToken);

      // Retry the original failed request with the fresh token
      if (originalRequest.headers) {
        (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
      }
      return apiClient(originalRequest);

    } catch (refreshError) {
      // ── Refresh failed → logout completely ────────────────────────────────
      processQueue(refreshError, null);
      useAuthStore.getState().clearAuth();

      // Redirect to login (without React Router — works outside component tree)
      window.location.href = '/auth/login';

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
