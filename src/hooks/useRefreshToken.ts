import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { setUser } from '../state/authSlice';
import { DEFAULT_REFRESH_TIMEOUT, delay } from '../utils/constants';
import { getItemFromStorage, setItemToStorage, removeItemFromStorage } from '../utils/storage';
import { LocalStorageKeys } from '../utils/types';

/**
 * Custom hook for handling refresh token operations
 *
 * @param refreshTokenMutation The RTK Query mutation for refreshing tokens
 * @param refreshInterval How often to refresh the token (ms)
 * @param maxRetryAttempts Maximum number of retry attempts on failure
 * @param retryDelay Delay between retry attempts (ms)
 * @returns A function that handles token refresh logic
 */
export const useRefreshToken = (
  refreshTokenMutation: any,
  refreshInterval: number = DEFAULT_REFRESH_TIMEOUT,
  maxRetryAttempts = 3,
  retryDelay = 1000
) => {
  const dispatch = useDispatch();

  const refreshTokenFunction = useCallback(async () => {
    // Check if we need to refresh based on last refresh time
    const lastRefreshTime = getItemFromStorage<number>(LocalStorageKeys.LAST_REFRESH_TIME);
    const currentTime = Date.now();

    // Only refresh if there's no lastRefreshTime or if enough time has passed
    if (!lastRefreshTime || currentTime - lastRefreshTime > refreshInterval * 0.9) {
      let retryCount = 0;
      let success = false;

      while (retryCount < maxRetryAttempts && !success) {
        try {
          // With cookie-based auth, we don't need to pass any parameters
          const response = await refreshTokenMutation().unwrap();

          // Update the Redux state with the user data from the response
          if (response && response.user) {
            dispatch(setUser(response.user));
            // Update last refresh time in localStorage
            setItemToStorage(LocalStorageKeys.LAST_REFRESH_TIME, currentTime);
            success = true;
          }
        } catch (error: any) {
          // Handle 401 errors (unauthorized)
          if ('status' in error && error.status === 401) {
            // Clear user state on error
            dispatch(setUser(null));
            // setUser(null) already removes lastRefreshTime in authSlice
            // Don't retry on 401 errors
            break;
          }
          // Network errors or other temporary issues
          else if (retryCount < maxRetryAttempts - 1) {
            retryCount++;
            // Wait before retrying
            await delay(retryDelay);
          } else {
            console.error('Token refresh failed after maximum retry attempts', error);
          }
        }
      }
    }
  }, [refreshTokenMutation, dispatch, refreshInterval, maxRetryAttempts, retryDelay]);

  return refreshTokenFunction;
};
