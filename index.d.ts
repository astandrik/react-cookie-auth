// Type definitions for react-cookie-auth
// Project: https://github.com/astandrik/react-cookie-auth

import { AuthLibConfig, AuthLibInstance } from './dist/src/utils/types';

// Re-export components
export * from './dist/src/components';

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
} from './dist/src/utils/types';

// Re-export utility functions
export { getAuthErrorMessage, isAuthError, getAuthErrorType } from './dist/src/utils/errors';
export {
  getItemFromStorage,
  setItemToStorage,
  removeItemFromStorage,
  clearAuthStorage,
} from './dist/src/utils/storage';

/**
 * Initialize the authentication library with the given configuration
 *
 * @param config The configuration for the authentication library
 * @returns An object containing Redux store, hooks, and API endpoints
 */
export declare function initAuth(config: AuthLibConfig): AuthLibInstance;
