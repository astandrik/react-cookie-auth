import { configureStore } from '@reduxjs/toolkit';

import { useRefreshToken } from './hooks/useRefreshToken';
import { createAuthApi } from './state/authApi';
import authReducer, { isAuthenticated, selectUser, setUser } from './state/authSlice';
import { AuthLibConfig, AuthLibInstance } from './utils/types';

// Re-export components
export * from './components';

// Re-export types
export type {
  AuthErrorType,
  User,
  AuthState,
  AuthLibConfig,
  AuthLibInstance,
  AuthStore,
  AuthHooks,
  AuthActions,
  AuthSelectors,
} from './utils/types';

// Re-export utility functions
export { getAuthErrorMessage, isAuthError, getAuthErrorType } from './utils/errors';

export {
  getItemFromStorage,
  setItemToStorage,
  removeItemFromStorage,
  clearAuthStorage,
} from './utils/storage';

/**
 * Initialize the authentication library with the given configuration
 *
 * @param config The configuration for the authentication library
 * @returns An object containing Redux store, hooks, and API endpoints
 */
export function initAuth(config: AuthLibConfig): AuthLibInstance {
  // Create the auth API with the provided configuration
  const authApi = createAuthApi(config);

  // Configure the Redux store
  const store = configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(authApi.middleware),
  });

  // Export hooks and API endpoints for the consuming application
  return {
    store,
    hooks: {
      useRefreshToken: (refreshTokenMutation: any) =>
        useRefreshToken(
          refreshTokenMutation,
          config.refreshTokenInterval,
          config.maxRetryAttempts,
          config.retryDelay
        ),
      useLoginMutation: authApi.endpoints.login.useMutation,
      useLogoutMutation: authApi.endpoints.logout.useMutation,
      useRefreshTokenMutation: authApi.endpoints.refreshToken.useMutation,
    },
    actions: {
      setUser,
    },
    selectors: {
      isAuthenticated,
      getUser: selectUser,
    },
  };
}
