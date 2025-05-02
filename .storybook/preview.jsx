import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { addons } from '@storybook/preview-api';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

// Import reducers and API
import authReducer from '../src/state/authSlice';
import { createAuthApi } from '../src/state/authApi';

// Create a mock auth API with minimal configuration
const mockAuthApi = createAuthApi({
  apiBaseUrl: 'https://api.example.com',
  loginEndpoint: '/auth/login',
  refreshTokenEndpoint: '/auth/refresh',
  logoutEndpoint: '/auth/logout',
});

/**
 * Create a mock Redux store for Storybook
 * @param {Object} initialState - Initial state for the store
 * @returns {Object} Configured Redux store
 */
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [mockAuthApi.reducerPath]: mockAuthApi.reducer,
      // Add other reducers as needed
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(mockAuthApi.middleware),
    preloadedState: initialState,
  });
};

/**
 * Redux store decorator for Storybook
 * Wraps stories with a Redux Provider
 */
export const withReduxProvider = (Story, context) => {
  // Get initialState from story parameters or use default
  const initialState = context.parameters.store?.initialState || {};
  const store = createMockStore(initialState);

  return (
    <Provider store={store}>
      <Story />
    </Provider>
  );
};

/**
 * Configure global decorators and parameters
 */
export const decorators = [withReduxProvider];

/**
 * Configure Storybook parameters
 */
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
    expanded: true,
    sort: 'requiredFirst',
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: 'responsive',
  },
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: '#ffffff' },
      { name: 'dark', value: '#333333' },
      { name: 'gray', value: '#f8f9fa' },
    ],
  },
  docs: {
    source: {
      state: 'open',
    },
    description: {
      component: null,
    },
  },
  options: {
    storySort: {
      order: ['Introduction', 'Authentication', ['Auth', 'AuthModal', 'LogoutModal']],
    },
  },
};