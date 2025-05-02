import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { getItemFromStorage, setItemToStorage } from '../utils/storage';
import { AuthReducer, AuthState, LocalStorageKeys, User } from '../utils/types';

/**
 * Initialize user from localStorage if available
 */
const initialState: AuthState = {
  user: getItemFromStorage<User>(LocalStorageKeys.CURRENT_USER) || null,
};

/**
 * Auth slice for managing authentication state
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Sets the current user
     * If the user is null, it clears the user (logout)
     */
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;

      // Persist user to localStorage, or remove if null
      if (typeof window !== 'undefined') {
        if (action.payload) {
          setItemToStorage(LocalStorageKeys.CURRENT_USER, action.payload);
        } else {
          // On logout (user is null), remove both user and lastRefreshTime from localStorage
          localStorage.removeItem(LocalStorageKeys.CURRENT_USER);
          localStorage.removeItem(LocalStorageKeys.LAST_REFRESH_TIME);
        }
      }
    },
  },
});

// Export actions
export const { setUser } = authSlice.actions;

// Export selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const isAuthenticated = (state: { auth: AuthState }) => !!state.auth.user;

// Export reducer with explicit type annotation
export default authSlice.reducer as AuthReducer;
