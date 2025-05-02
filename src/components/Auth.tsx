import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { isAuthenticated } from '../state/authSlice';
import { getRandomDelay } from '../utils/constants';

/**
 * Props for the Auth component
 */
export interface AuthProps {
  children: React.ReactNode;
  refreshFunction: () => Promise<void>;
  refreshInterval: number;
  onAuthStateChange?: (isAuthenticated: boolean) => void;
  invalidateAuthTags?: () => void;
}

/**
 * Auth component that handles authentication state and refresh token logic
 *
 * This component:
 * 1. Validates authentication status on mount via refresh token
 * 2. Sets up periodic refresh of auth cookies using Page Visibility API
 * 3. Prevents interval queuing during device sleep/wake cycles
 * 4. Calls an optional callback when auth state changes
 */
export const Auth: React.FC<AuthProps> = ({
  children,
  refreshFunction,
  refreshInterval,
  onAuthStateChange,
  invalidateAuthTags,
}) => {
  const isUserAuthenticated = useSelector(isAuthenticated);
  const prevAuthStateRef = useRef<boolean>(isUserAuthenticated);

  // References for managing intervals and visibility state
  const refreshTokenIntervalRef = useRef<number | null>(null);
  const pendingTimeoutRef = useRef<number | null>(null);
  const wasHiddenRef = useRef<boolean>(false);

  // Handle authentication state changes
  useEffect(() => {
    if (isUserAuthenticated !== prevAuthStateRef.current) {
      prevAuthStateRef.current = isUserAuthenticated;

      // Notify about auth state change if callback provided
      if (onAuthStateChange) {
        onAuthStateChange(isUserAuthenticated);
      }

      // Invalidate auth tags if function provided
      if (invalidateAuthTags) {
        invalidateAuthTags();
      }
    }
  }, [isUserAuthenticated, onAuthStateChange, invalidateAuthTags]);

  // Helper function to clear any existing interval
  const clearRefreshInterval = () => {
    if (refreshTokenIntervalRef.current) {
      clearInterval(refreshTokenIntervalRef.current);
      refreshTokenIntervalRef.current = null;
    }
  };

  // Helper function to clear any pending timeout
  const clearPendingTimeout = () => {
    if (pendingTimeoutRef.current) {
      clearTimeout(pendingTimeoutRef.current);
      pendingTimeoutRef.current = null;
    }
  };

  // Helper function to set up the refresh interval
  const setupRefreshInterval = () => {
    clearRefreshInterval();
    refreshTokenIntervalRef.current = window.setInterval(refreshFunction, refreshInterval);
  };

  // Handle page visibility changes to prevent interval queuing during sleep
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      // Page is hidden (device may sleep) - clear the interval
      wasHiddenRef.current = true;
      clearRefreshInterval();
      clearPendingTimeout();
    } else if (document.visibilityState === 'visible' && isUserAuthenticated) {
      // Only do the single refresh if we were previously hidden
      if (wasHiddenRef.current) {
        // Reset the hidden state
        wasHiddenRef.current = false;

        // Clean up any existing intervals and timeouts to prevent duplicates
        clearRefreshInterval();
        clearPendingTimeout();

        // Page is visible again - perform a single refresh after random delay
        // to prevent all tabs from refreshing simultaneously
        const delayMs = getRandomDelay();

        pendingTimeoutRef.current = window.setTimeout(() => {
          try {
            // Clear the timeout reference
            pendingTimeoutRef.current = null;

            // Perform the refresh operation
            refreshFunction();

            // Then restart the normal interval
            setupRefreshInterval();
          } catch (error) {
            console.error('Error in refresh token after visibility change:', error);
          }
        }, delayMs);
      }
    }
  };

  // Set up periodic token refresh check with Page Visibility API
  useEffect(() => {
    if (isUserAuthenticated) {
      // Reset the hidden state on mount or auth change
      wasHiddenRef.current = false;

      // Initial refresh when component mounts
      refreshFunction();

      // Set up the normal refresh interval
      setupRefreshInterval();

      // Make sure we remove any existing listener before adding a new one
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('visibilitychange', handleVisibilityChange);
    } else {
      // Clear the interval if the user is not authenticated
      clearRefreshInterval();
      clearPendingTimeout();
    }

    return () => {
      // Cleanup on component unmount
      clearRefreshInterval();
      clearPendingTimeout();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshFunction, isUserAuthenticated, refreshInterval]);

  return <>{children}</>;
};
