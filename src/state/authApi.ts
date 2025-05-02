import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { setItemToStorage } from '../utils/storage';
import {
  AuthLibConfig,
  LocalStorageKeys,
  LoginCredentials,
  RefreshTokenResponse,
  TokenResponse,
} from '../utils/types';

/**
 * Creates an authentication API service with RTK Query
 *
 * @param config The authentication library configuration
 * @returns The configured auth API
 */
export const createAuthApi = (config: AuthLibConfig) => {
  // Create the base api with the configured base URL
  const api = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: config.apiBaseUrl }),
    endpoints: builder => ({
      login: builder.mutation<TokenResponse, LoginCredentials>({
        query: credentials => ({
          url: config.loginEndpoint,
          method: 'POST',
          body: credentials,
        }),
        // Set the LAST_REFRESH_TIME on successful login to prevent unnecessary token refresh
        onQueryStarted: async (_, { queryFulfilled }) => {
          try {
            await queryFulfilled;
            // Set the current time as the last refresh time
            setItemToStorage(LocalStorageKeys.LAST_REFRESH_TIME, Date.now());

            // Call the optional success callback if provided
            const result = await queryFulfilled;
            if (config.onLoginSuccess && result.data.user) {
              config.onLoginSuccess(result.data.user);
            }
          } catch (error) {
            // Login failed, call the error callback if provided
            if (config.onAuthError) {
              config.onAuthError(error);
            }
          }
        },
      }),
      refreshToken: builder.mutation<RefreshTokenResponse, void>({
        query: () => ({
          url: config.refreshTokenEndpoint,
          method: 'POST',
          // No body needed as refresh token is in the cookies
        }),
        // The server should return user data alongside new tokens
      }),
      logout: builder.mutation<void, void>({
        query: () => ({
          url: config.logoutEndpoint,
          method: 'POST',
          // No body needed as tokens are in the cookies
        }),
        // Clear all auth-related data on logout
        onQueryStarted: async (_, { queryFulfilled }) => {
          try {
            await queryFulfilled;
            // Clear LAST_REFRESH_TIME to ensure consistent cleanup
            localStorage.removeItem(LocalStorageKeys.LAST_REFRESH_TIME);

            // Call the optional logout success callback if provided
            if (config.onLogoutSuccess) {
              config.onLogoutSuccess();
            }
          } catch (error) {
            // Logout failed, call the error callback if provided
            if (config.onAuthError) {
              config.onAuthError(error);
            }
          }
        },
      }),
    }),
    tagTypes: ['Auth'],
  });

  return api;
};

// Export types for convenience
export type AuthApi = ReturnType<typeof createAuthApi>;

// Helper types for hooks
export type UseLoginMutation = ReturnType<AuthApi['endpoints']['login']['useMutation']>;
export type UseRefreshTokenMutation = ReturnType<
  AuthApi['endpoints']['refreshToken']['useMutation']
>;
export type UseLogoutMutation = ReturnType<AuthApi['endpoints']['logout']['useMutation']>;
