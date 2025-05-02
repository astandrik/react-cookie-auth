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

/**
 * Interface for the Redux store type returned by initAuth
 */
export interface AuthStore {
  auth: AuthState;
  [key: string]: any; // Allow for dynamic reducer paths
}

/**
 * Interface for the hooks returned by the initAuth function
 */
export interface AuthHooks {
  useRefreshToken: (refreshTokenMutation: any) => () => Promise<void>;
  useLoginMutation: any;
  useLogoutMutation: any;
  useRefreshTokenMutation: any;
}

/**
 * Interface for the actions returned by the initAuth function
 */
export interface AuthActions {
  setUser: (user: User | null) => void;
}

/**
 * Interface for the selectors returned by the initAuth function
 */
export interface AuthSelectors {
  isAuthenticated: (state: { auth: AuthState }) => boolean;
  getUser: (state: { auth: AuthState }) => User | null;
}

/**
 * Interface for the complete object returned by the initAuth function
 */
export interface AuthLibInstance {
  store: {
    dispatch: any;
    getState: () => AuthStore;
    subscribe: any;
    replaceReducer: any;
  };
  hooks: AuthHooks;
  actions: AuthActions;
  selectors: AuthSelectors;
}

/**
 * Type for the auth reducer function
 */
export type AuthReducer = (state: AuthState | undefined, action: any) => AuthState;
