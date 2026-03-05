import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserProfile } from '../types/auth.types';

// ─────────────────────────────────────────────────────────────────────────────
// State + Actions interface
// ─────────────────────────────────────────────────────────────────────────────

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  /** Call after login / register — sets user + token together */
  setAuth: (user: UserProfile, accessToken: string) => void;
  /** Silently update stored token (after refresh) */
  setToken: (accessToken: string) => void;
  /** Update user profile data only */
  setUser: (user: UserProfile) => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Clear everything on logout or refresh failure */
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

// ─────────────────────────────────────────────────────────────────────────────
// Store — persisted to localStorage (only user + token, NOT refresh cookie)
// ─────────────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // ── Initial state ─────────────────────────────────────────────────────
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      // ── Actions ───────────────────────────────────────────────────────────
      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true, isLoading: false }),

      setToken: (accessToken) =>
        set({ accessToken }),

      setUser: (user) =>
        set({ user }),

      setLoading: (isLoading) =>
        set({ isLoading }),

      clearAuth: () =>
        set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false }),
    }),
    {
      name: 'hotelbooking-auth',          // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist user + token — isLoading is transient
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ─────────────────────────────────────────────────────────────────────────────
// Convenience selectors (use these in components for minimal re-renders)
// ─────────────────────────────────────────────────────────────────────────────

export const selectUser            = (s: AuthStore) => s.user;
export const selectIsAuthenticated = (s: AuthStore) => s.isAuthenticated;
export const selectAccessToken     = (s: AuthStore) => s.accessToken;
export const selectIsLoading       = (s: AuthStore) => s.isLoading;
