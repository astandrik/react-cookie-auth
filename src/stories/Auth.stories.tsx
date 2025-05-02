import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Import all authentication components
import { Auth } from '../components/Auth';
import { AuthModal } from '../components/AuthModal';
import { LogoutModal } from '../components/LogoutModal';
import { UseLoginMutation, UseLogoutMutation, UseRefreshTokenMutation } from '../state/authApi';
import { AuthErrorType, LocalStorageKeys, User } from '../utils/types';

// Mock localStorage to visualize state changes
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => {
      return store[key] || null;
    },
    setItem: (key: string, value: string) => {
      store[key] = value;
      action('localStorage.setItem')(`${key}: ${value}`);
    },
    removeItem: (key: string) => {
      action('localStorage.removeItem')(key);
      delete store[key];
    },
    clear: () => {
      action('localStorage.clear')('Cleared all items');
      store = {};
    },
    getAll: () => {
      return store;
    },
  };
})();

// Inject mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Component to display localStorage contents
const LocalStorageDisplay = () => {
  const [storage, setStorage] = useState<Record<string, string>>({});

  // Update the display periodically
  useEffect(() => {
    const updateStorage = () => {
      setStorage({ ...localStorageMock.getAll() });
    };

    // Initial update
    updateStorage();

    // Set an interval to check for changes
    const interval = setInterval(updateStorage, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-md">
      <h3 className="text-lg font-semibold mb-2">localStorage Contents:</h3>
      {Object.keys(storage).length > 0 ? (
        <pre className="text-sm overflow-auto max-h-40 p-2 bg-gray-200 rounded">
          {JSON.stringify(storage, null, 2)}
        </pre>
      ) : (
        <p className="text-gray-500 italic">localStorage is empty</p>
      )}
    </div>
  );
};

// Create mock refresh token functions with different behaviors
const successfulRefreshFunction = (): Promise<void> => {
  action('refreshToken')('Token refreshed successfully');
  localStorageMock.setItem(LocalStorageKeys.LAST_REFRESH_TIME, JSON.stringify(Date.now()));
  return Promise.resolve();
};

const failingRefreshFunction = (): Promise<void> => {
  action('refreshToken')('Token refresh failed');
  return Promise.reject(new Error('Failed to refresh token'));
};

const timeoutRefreshFunction = (): Promise<void> => {
  action('refreshToken')('Token refresh timed out');
  return new Promise<void>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Token refresh timed out'));
    }, 3000);
  });
};

const networkErrorRefreshFunction = (): Promise<void> => {
  action('refreshToken')('Network error during token refresh');
  return Promise.reject({
    message: 'Network Error',
    status: 0,
  });
};

// Create mock versions of RTK Query hooks
const createMockLoginMutation = (
  options: {
    isLoading?: boolean;
    isError?: boolean;
    error?: any;
    success?: boolean;
  } = {}
): UseLoginMutation => {
  // The trigger function
  const loginFn = () => {
    action('login')('Login attempted');
    if (options.isError) {
      return {
        unwrap: () => Promise.reject(options.error || new Error('Login failed')),
      } as any;
    }
    return {
      unwrap: () =>
        Promise.resolve({
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
          },
        }),
    } as any;
  };

  // The result object with RTK Query expected properties
  const resultObject = {
    isLoading: options.isLoading || false,
    isError: options.isError || false,
    error: options.error || null,
    isSuccess: options.success || false,
    isUninitialized: !(options.isLoading || options.isError || options.success),
    status: options.isLoading
      ? 'pending'
      : options.isError
        ? 'rejected'
        : options.success
          ? 'fulfilled'
          : 'uninitialized',
    data: undefined,
    reset: () => action('reset')('Login state reset'),
    originalArgs: undefined,
    endpointName: 'login',
  };

  // Cast to the expected type
  return [loginFn, resultObject] as unknown as UseLoginMutation;
};

// Create a mock version of useLogoutMutation
const createMockLogoutMutation = (
  options: {
    isLoading?: boolean;
    isError?: boolean;
    error?: any;
    success?: boolean;
  } = {}
): UseLogoutMutation => {
  // The trigger function
  const logoutFn = () => {
    action('logout')('Logout attempted');
    if (options.isError) {
      return {
        unwrap: () => Promise.reject(options.error || new Error('Logout failed')),
      } as any;
    }
    return {
      unwrap: () => Promise.resolve(),
    } as any;
  };

  // The result object with RTK Query expected properties
  const resultObject = {
    isLoading: options.isLoading || false,
    isError: options.isError || false,
    error: options.error || null,
    isSuccess: options.success || false,
    isUninitialized: !(options.isLoading || options.isError || options.success),
    status: options.isLoading
      ? 'pending'
      : options.isError
        ? 'rejected'
        : options.success
          ? 'fulfilled'
          : 'uninitialized',
    data: undefined,
    reset: () => action('reset')('Logout state reset'),
    originalArgs: undefined,
    endpointName: 'logout',
  };

  // Cast to the expected type
  return [logoutFn, resultObject] as unknown as UseLogoutMutation;
};

// Create a mock version of useRefreshTokenMutation
const createMockRefreshTokenMutation = (
  options: {
    isLoading?: boolean;
    isError?: boolean;
    error?: any;
    success?: boolean;
  } = {}
): UseRefreshTokenMutation => {
  // The trigger function
  const refreshFn = () => {
    action('refreshToken')('Refresh token attempted');
    if (options.isError) {
      return {
        unwrap: () => Promise.reject(options.error || new Error('Refresh failed')),
      } as any;
    }
    return {
      unwrap: () =>
        Promise.resolve({
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
          },
        }),
    } as any;
  };

  // The result object with RTK Query expected properties
  const resultObject = {
    isLoading: options.isLoading || false,
    isError: options.isError || false,
    error: options.error || null,
    isSuccess: options.success || false,
    isUninitialized: !(options.isLoading || options.isError || options.success),
    status: options.isLoading
      ? 'pending'
      : options.isError
        ? 'rejected'
        : options.success
          ? 'fulfilled'
          : 'uninitialized',
    data: undefined,
    reset: () => action('reset')('Refresh token state reset'),
    originalArgs: undefined,
    endpointName: 'refreshToken',
  };

  // Cast to the expected type
  return [refreshFn, resultObject] as unknown as UseRefreshTokenMutation;
};

// Create a store creator to allow different auth states in stories
const createMockStore = (initialAuthState: any = {}) => {
  // Create a mock auth slice with the same interface as the real one
  const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null, ...initialAuthState },
    reducers: {
      setUser: (state, action) => {
        state.user = action.payload;
        // Simulate the localStorage side effect
        if (action.payload) {
          localStorageMock.setItem(LocalStorageKeys.CURRENT_USER, JSON.stringify(action.payload));
        } else {
          localStorageMock.removeItem(LocalStorageKeys.CURRENT_USER);
          localStorageMock.removeItem(LocalStorageKeys.LAST_REFRESH_TIME);
        }
      },
    },
  });

  // Create the Redux store with the auth slice
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware(),
  });
};

// Define Auth component meta
const authMeta: Meta<typeof Auth> = {
  title: 'Authentication/Auth',
  component: Auth,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ padding: '1rem', border: '1px dashed #ccc' }}>
        <Story />
      </div>
    ),
  ],
};

// Auth component stories
type AuthStory = StoryObj<typeof Auth>;

// 1. UnauthenticatedState Story
export const UnauthenticatedState: AuthStory = {
  name: '1. Unauthenticated State',
  decorators: [
    Story => {
      const store = createMockStore(); // Empty user = unauthenticated

      return (
        <Provider store={store}>
          <div className="p-4">
            <h2 className="text-xl mb-4">Unauthenticated State</h2>
            <p className="mb-4 text-gray-700">
              User is not authenticated. The Auth component is showing the fallback content.
            </p>
            <Story />
            <LocalStorageDisplay />
          </div>
        </Provider>
      );
    },
  ],
  args: {
    refreshFunction: successfulRefreshFunction,
    refreshInterval: 300000, // 5 minutes
    onAuthStateChange: isAuthenticated => {
      action('authStateChanged')(
        `Authentication state: ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`
      );
    },
    children: (
      <div className="p-4 bg-red-100 border border-red-300 rounded-md text-red-700">
        Please log in to view this content.
      </div>
    ),
  },
};

// 2. AuthenticatedState Story
export const AuthenticatedState: AuthStory = {
  name: '2. Authenticated State',
  decorators: [
    Story => {
      // Create a store with an authenticated user
      const store = createMockStore({
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
        },
      });

      // Set up the localStorage to match the store state
      useEffect(() => {
        localStorageMock.setItem(
          LocalStorageKeys.CURRENT_USER,
          JSON.stringify({
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
          })
        );
        localStorageMock.setItem(LocalStorageKeys.LAST_REFRESH_TIME, JSON.stringify(Date.now()));
      }, []);

      return (
        <Provider store={store}>
          <div className="p-4">
            <h2 className="text-xl mb-4">Authenticated State</h2>
            <p className="mb-4 text-gray-700">
              User is authenticated. The Auth component is showing the protected content.
            </p>
            <Story />
            <LocalStorageDisplay />
          </div>
        </Provider>
      );
    },
  ],
  args: {
    refreshFunction: successfulRefreshFunction,
    refreshInterval: 300000, // 5 minutes
    onAuthStateChange: isAuthenticated => {
      action('authStateChanged')(
        `Authentication state: ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`
      );
    },
    children: (
      <div className="p-4 bg-green-100 border border-green-300 rounded-md text-green-700">
        Welcome back! You are now viewing protected content.
      </div>
    ),
  },
};

// 3. LoginSuccess Story
export const LoginSuccess: AuthStory = {
  name: '3. Login Success',
  decorators: [
    Story => {
      const store = createMockStore(); // Start unauthenticated

      return (
        <Provider store={store}>
          <div className="p-4">
            <h2 className="text-xl mb-4">Login Success Flow</h2>
            <p className="mb-4 text-gray-700">
              Demonstrates a successful login flow. Submit the form to see the state change.
            </p>
            <Story />
            <LocalStorageDisplay />
          </div>
        </Provider>
      );
    },
  ],
  args: {
    refreshFunction: successfulRefreshFunction,
    refreshInterval: 300000,
    children: (
      <div>
        <AuthModal
          isOpen={true}
          onClose={action('modal closed')}
          useLoginMutation={createMockLoginMutation({ success: true })}
          config={{
            titleText: 'Login',
            usernameLabel: 'Username',
            passwordLabel: 'Password',
            submitButtonText: 'Sign In',
            showRememberMe: true,
            onLoginSuccess: username => {
              action('loginSuccess')(`User ${username} logged in successfully`);
            },
          }}
        />
        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-700">
          Protected content with login modal - try logging in!
        </div>
      </div>
    ),
  },
};

// 4. LoginFailure Story
export const LoginFailure: AuthStory = {
  name: '4. Login Failure',
  decorators: [
    Story => {
      const store = createMockStore(); // Start unauthenticated

      return (
        <Provider store={store}>
          <div className="p-4">
            <h2 className="text-xl mb-4">Login Failure Flow</h2>
            <p className="mb-4 text-gray-700">
              Demonstrates a login flow with authentication errors. Submit the form to see the
              error.
            </p>
            <Story />
            <LocalStorageDisplay />
          </div>
        </Provider>
      );
    },
  ],
  args: {
    refreshFunction: successfulRefreshFunction,
    refreshInterval: 300000,
    children: (
      <div>
        <AuthModal
          isOpen={true}
          onClose={action('modal closed')}
          useLoginMutation={createMockLoginMutation({
            isError: true,
            error: {
              status: 401,
              data: {
                error_type: AuthErrorType.INVALID_CREDENTIALS,
                detail: 'Invalid username or password',
              },
            },
          })}
          config={{
            titleText: 'Login with Error',
            usernameLabel: 'Username',
            passwordLabel: 'Password',
            submitButtonText: 'Sign In',
          }}
        />
        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-700">
          Protected content with login modal (will show error on submit)
        </div>
      </div>
    ),
  },
};

// 5. LoginLoading Story
export const LoginLoading: AuthStory = {
  name: '5. Login Loading',
  decorators: [
    Story => {
      const store = createMockStore(); // Start unauthenticated

      return (
        <Provider store={store}>
          <div className="p-4">
            <h2 className="text-xl mb-4">Login Loading State</h2>
            <p className="mb-4 text-gray-700">Demonstrates the loading state during login.</p>
            <Story />
            <LocalStorageDisplay />
          </div>
        </Provider>
      );
    },
  ],
  args: {
    refreshFunction: successfulRefreshFunction,
    refreshInterval: 300000,
    children: (
      <div>
        <AuthModal
          isOpen={true}
          onClose={action('modal closed')}
          useLoginMutation={createMockLoginMutation({ isLoading: true })}
          config={{
            titleText: 'Login (Loading)',
            usernameLabel: 'Username',
            passwordLabel: 'Password',
            submitButtonText: 'Sign In',
            loadingText: 'Signing In...',
          }}
        />
        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-700">
          Protected content with login modal in loading state
        </div>
      </div>
    ),
  },
};

// 6. LogoutSuccess Story
export const LogoutSuccess: AuthStory = {
  name: '6. Logout Success',
  decorators: [
    Story => {
      // Create a store with an authenticated user
      const store = createMockStore({
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
        },
      });

      // Set up the localStorage to match the store state
      useEffect(() => {
        localStorageMock.setItem(
          LocalStorageKeys.CURRENT_USER,
          JSON.stringify({
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
          })
        );
        localStorageMock.setItem(LocalStorageKeys.LAST_REFRESH_TIME, JSON.stringify(Date.now()));
      }, []);

      return (
        <Provider store={store}>
          <div className="p-4">
            <h2 className="text-xl mb-4">Logout Success Flow</h2>
            <p className="mb-4 text-gray-700">
              Demonstrates a successful logout flow. Confirm logout to see the state change.
            </p>
            <Story />
            <LocalStorageDisplay />
          </div>
        </Provider>
      );
    },
  ],
  args: {
    refreshFunction: successfulRefreshFunction,
    refreshInterval: 300000,
    children: (
      <div>
        <LogoutModal
          isOpen={true}
          onClose={action('modal closed')}
          useLogoutMutation={createMockLogoutMutation({ success: true })}
          config={{
            titleText: 'Logout',
            confirmationText: 'Are you sure you want to log out?',
            confirmButtonText: 'Yes, Log Out',
            cancelButtonText: 'Cancel',
            onLogoutSuccess: () => {
              action('logoutSuccess')('User logged out successfully');
            },
          }}
        />
        <div className="p-4 bg-green-100 border border-green-300 rounded-md text-green-700">
          You&apos;re logged in! Try logging out with the logout modal.
        </div>
      </div>
    ),
  },
};

// 7. LogoutFailure Story
export const LogoutFailure: AuthStory = {
  name: '7. Logout Failure',
  decorators: [
    Story => {
      // Create a store with an authenticated user
      const store = createMockStore({
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
        },
      });

      // Set up the localStorage to match the store state
      useEffect(() => {
        localStorageMock.setItem(
          LocalStorageKeys.CURRENT_USER,
          JSON.stringify({
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
          })
        );
        localStorageMock.setItem(LocalStorageKeys.LAST_REFRESH_TIME, JSON.stringify(Date.now()));
      }, []);

      return (
        <Provider store={store}>
          <div className="p-4">
            <h2 className="text-xl mb-4">Logout Failure</h2>
            <p className="mb-4 text-gray-700">
              Demonstrates a logout flow with server errors. Note: The modal still closes because we
              don&apos;t want to trap users.
            </p>
            <Story />
            <LocalStorageDisplay />
          </div>
        </Provider>
      );
    },
  ],
  args: {
    refreshFunction: successfulRefreshFunction,
    refreshInterval: 300000,
    children: (
      <div>
        <LogoutModal
          isOpen={true}
          onClose={action('modal closed')}
          useLogoutMutation={createMockLogoutMutation({
            isError: true,
            error: {
              status: 500,
              data: { detail: 'Server error during logout' },
            },
          })}
          config={{
            titleText: 'Logout (Will Fail)',
            confirmationText: 'Try to log out (this will generate an error)',
            confirmButtonText: 'Yes, Log Out',
            cancelButtonText: 'Cancel',
            errorText: 'There might be an error logging out',
            onLogoutError: error => {
              action('logoutError')(JSON.stringify(error));
            },
          }}
        />
        <div className="p-4 bg-green-100 border border-green-300 rounded-md text-green-700">
          You&apos;re logged in! The logout will fail but the modal will close.
        </div>
      </div>
    ),
  },
};

// 8. TokenRefreshSuccess Story
export const TokenRefreshSuccess: AuthStory = {
  name: '8. Token Refresh Success',
  decorators: [
    Story => {
      // Create a store with an authenticated user
      const store = createMockStore({
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
        },
      });

      // Set up the localStorage to match the store state
      useEffect(() => {
        localStorageMock.setItem(
          LocalStorageKeys.CURRENT_USER,
          JSON.stringify({
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
          })
        );
        // Set a refresh time that's old enough to trigger a refresh
        localStorageMock.setItem(
          LocalStorageKeys.LAST_REFRESH_TIME,
          JSON.stringify(Date.now() - 600000) // 10 minutes ago
        );
      }, []);

      return (
        <Provider store={store}>
          <div className="p-4">
            <h2 className="text-xl mb-4">Token Refresh Success</h2>
            <p className="mb-4 text-gray-700">
              Demonstrates successful token refresh. The token will be refreshed immediately when
              the component mounts.
            </p>
            <Story />
            <LocalStorageDisplay />
          </div>
        </Provider>
      );
    },
  ],
  args: {
    // Use a 5-second interval to see the refresh happen soon for demo purposes
    refreshInterval: 5000,
    refreshFunction: successfulRefreshFunction,
    onAuthStateChange: isAuthenticated => {
      action('authStateChanged')(
        `Authentication state: ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`
      );
    },
    children: (
      <div className="p-4 bg-green-100 border border-green-300 rounded-md text-green-700">
        Token will be refreshed when component mounts and every 5 seconds.
      </div>
    ),
  },
};

// 9. TokenRefreshFailure Story
export const TokenRefreshFailure: AuthStory = {
  name: '9. Token Refresh Failure',
  decorators: [
    Story => {
      // Create a store with an authenticated user
      const store = createMockStore({
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
        },
      });

      // Set up the localStorage to match the store state
      useEffect(() => {
        localStorageMock.setItem(
          LocalStorageKeys.CURRENT_USER,
          JSON.stringify({
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
          })
        );
        // Set a refresh time that's old enough to trigger a refresh
        localStorageMock.setItem(
          LocalStorageKeys.LAST_REFRESH_TIME,
          JSON.stringify(Date.now() - 600000) // 10 minutes ago
        );
      }, []);

      return (
        <Provider store={store}>
          <div className="p-4">
            <h2 className="text-xl mb-4">Token Refresh Failure</h2>
            <p className="mb-4 text-gray-700">
              Demonstrates token refresh failure. The refresh function will reject with an error.
            </p>
            <Story />
            <LocalStorageDisplay />
          </div>
        </Provider>
      );
    },
  ],
  args: {
    refreshInterval: 5000, // Short interval for demo
    refreshFunction: failingRefreshFunction,
    onAuthStateChange: isAuthenticated => {
      action('authStateChanged')(
        `Authentication state: ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`
      );
    },
    children: (
      <div className="p-4 bg-blue-100 border border-blue-300 rounded-md text-blue-700">
        Token refresh will fail when attempted. Check the action logger.
      </div>
    ),
  },
};

// 10. TokenRefreshTimeout Story
export const TokenRefreshTimeout: AuthStory = {
  name: '10. Token Refresh Timeout',
  decorators: [
    Story => {
      // Create a store with an authenticated user
      const store = createMockStore({
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
        },
      });

      // Set up the localStorage to match the store state
      useEffect(() => {
        localStorageMock.setItem(
          LocalStorageKeys.CURRENT_USER,
          JSON.stringify({
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
          })
        );
        // Set a refresh time that's old enough to trigger a refresh
        localStorageMock.setItem(
          LocalStorageKeys.LAST_REFRESH_TIME,
          JSON.stringify(Date.now() - 600000) // 10 minutes ago
        );
      }, []);

      return (
        <Provider store={store}>
          <div className="p-4">
            <h2 className="text-xl mb-4">Token Refresh Timeout</h2>
            <p className="mb-4 text-gray-700">
              Demonstrates a token refresh that times out after 3 seconds.
            </p>
            <Story />
            <LocalStorageDisplay />
          </div>
        </Provider>
      );
    },
  ],
  args: {
    refreshInterval: 10000, // Longer interval for the timeout demo
    refreshFunction: timeoutRefreshFunction,
    onAuthStateChange: isAuthenticated => {
      action('authStateChanged')(
        `Authentication state: ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`
      );
    },
    children: (
      <div className="p-4 bg-purple-100 border border-purple-300 rounded-md text-purple-700">
        Token refresh will time out after 3 seconds. Check the action logger.
      </div>
    ),
  },
};

// 11. LocalStorageIntegration Story
export const LocalStorageIntegration: AuthStory = {
  name: '11. localStorage Integration',
  decorators: [
    Story => {
      // Create a store with an authenticated user
      const store = createMockStore({
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
        },
      });

      // Define function to clear the storage for demo
      const clearStorage = () => {
        localStorageMock.clear();
        action('manualAction')('Cleared localStorage');
      };

      // Define function to restore the user for demo
      const restoreUser = () => {
        localStorageMock.setItem(
          LocalStorageKeys.CURRENT_USER,
          JSON.stringify({
            id: 1,
            username: 'restoreuser',
            email: 'restore@example.com',
            first_name: 'Restored',
            last_name: 'User',
          })
        );
        localStorageMock.setItem(LocalStorageKeys.LAST_REFRESH_TIME, JSON.stringify(Date.now()));
        action('manualAction')('Restored user to localStorage');
      };

      return (
        <Provider store={store}>
          <div className="p-4">
            <h2 className="text-xl mb-4">localStorage Integration</h2>
            <p className="mb-4 text-gray-700">
              Demonstrates interaction with localStorage. Use the buttons to modify localStorage and
              observe the effects.
            </p>
            <div className="mb-4 flex space-x-2">
              <button
                onClick={clearStorage}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Clear localStorage
              </button>
              <button
                onClick={restoreUser}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Restore User
              </button>
            </div>
            <Story />
            <LocalStorageDisplay />
          </div>
        </Provider>
      );
    },
  ],
  args: {
    refreshInterval: 30000,
    refreshFunction: successfulRefreshFunction,
    onAuthStateChange: isAuthenticated => {
      action('authStateChanged')(
        `Authentication state: ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`
      );
    },
    children: (
      <div className="p-4 bg-indigo-100 border border-indigo-300 rounded-md text-indigo-700">
        This story demonstrates localStorage integration. Use the buttons above to interact with
        localStorage.
      </div>
    ),
  },
};

// 12. NetworkErrorHandling Story
export const NetworkErrorHandling: AuthStory = {
  name: '12. Network Error Handling',
  decorators: [
    Story => {
      // Create a store with an authenticated user
      const store = createMockStore({
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
        },
      });

      // Set up the localStorage to match the store state
      useEffect(() => {
        localStorageMock.setItem(
          LocalStorageKeys.CURRENT_USER,
          JSON.stringify({
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
          })
        );
        // Set a refresh time that's old enough to trigger a refresh
        localStorageMock.setItem(
          LocalStorageKeys.LAST_REFRESH_TIME,
          JSON.stringify(Date.now() - 600000) // 10 minutes ago
        );
      }, []);

      return (
        <Provider store={store}>
          <div className="p-4">
            <h2 className="text-xl mb-4">Network Error Handling</h2>
            <p className="mb-4 text-gray-700">
              Demonstrates how the component handles network errors during token refresh.
            </p>
            <Story />
            <LocalStorageDisplay />
          </div>
        </Provider>
      );
    },
  ],
  args: {
    refreshInterval: 5000, // Short interval for demo
    refreshFunction: networkErrorRefreshFunction,
    onAuthStateChange: isAuthenticated => {
      action('authStateChanged')(
        `Authentication state: ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`
      );
    },
    children: (
      <div className="p-4 bg-orange-100 border border-orange-300 rounded-md text-orange-700">
        This demonstrates network error handling during token refresh. Check the action logger.
      </div>
    ),
  },
};

// Set Auth component stories as the default export
export default {
  ...authMeta,
};
