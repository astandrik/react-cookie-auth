/**
 * LocalStorage keys used by the authentication library
 */
export enum LocalStorageKeys {
  CURRENT_USER = 'react_cookie_auth_current_user',
  LAST_REFRESH_TIME = 'react_cookie_auth_last_refresh_time',
}

/**
 * User interface with basic user information
 */
export interface User {
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  username: string;
}

/**
 * Authentication state interface
 */
export interface AuthState {
  user: User | null;
}

/**
 * Authentication error types
 */
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'invalid_credentials',
  ACCOUNT_DISABLED = 'account_disabled',
  ACCOUNT_LOCKED = 'account_locked',
  TOKEN_EXPIRED = 'token_expired',
  TOKEN_INVALID = 'token_invalid',
  TOKEN_BLACKLISTED = 'token_blacklisted',
  SYSTEM_ERROR = 'system_error',
}

/**
 * API response interfaces
 */
export interface LoginCredentials {
  username: string;
  password: string;
  remember?: boolean;
}

export interface TokenResponse {
  user: User;
}

export type RefreshTokenResponse = TokenResponse;

/**
 * Configuration options for the authentication library
 */
export interface AuthLibConfig {
  apiBaseUrl: string;
  loginEndpoint: string;
  refreshTokenEndpoint: string;
  logoutEndpoint: string;
  refreshTokenInterval: number;
  maxRetryAttempts: number;
  retryDelay: number;
  onLoginSuccess?: (user: User) => void;
  onLogoutSuccess?: () => void;
  onAuthError?: (error: any) => void;
}
