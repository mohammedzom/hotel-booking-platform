// ─────────────────────────────────────────────────────────────────────────────
// Auth Types — mirrors C# HotelBooking.Contracts/Auth exactly
// ─────────────────────────────────────────────────────────────────────────────

export interface TokenResponse {
  accessToken: string;
  expiresOnUtc: string; // ISO datetime
}

export interface AuthResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  token: TokenResponse;
}

export interface ProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  role: string;
  createdAt: string;
  updatedAt: string | null;
}

// ── Request payloads ──────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

// ── Store-layer user shape (derived from AuthResponse / ProfileResponse) ──────

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  role: string;
  createdAt: string;
}
