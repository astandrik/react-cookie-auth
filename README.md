# react-cookie-auth

[![npm version](https://img.shields.io/npm/v/react-cookie-auth.svg)](https://www.npmjs.com/package/react-cookie-auth)

A secure authentication library for React applications that implements HTTP-only cookie-based authentication with automatic token refresh, Page Visibility API integration, and Redux state management.

## Table of Contents

- [Key Features](#key-features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Components](#components)
- [API Reference](#api-reference)
- [Security Benefits](#security-benefits)
- [Comparison with Other Solutions](#comparison-with-other-solutions)
- [Advanced Usage](#advanced-usage)
- [Troubleshooting](#troubleshooting)
- [Storybook](#storybook)
- [License](#license)

## Key Features

- **Secure Authentication**: HTTP-only cookie-based auth that mitigates XSS attacks
- **Complete Flow**: Login, logout, and token refresh functionality out of the box
- **Sleep/Wake Protection**: Page Visibility API integration prevents refresh token storms
- **State Management**: Redux integration with useful selectors and actions
- **UI Components**: Ready-to-use auth modals with customization options
- **Developer Experience**: TypeScript support and comprehensive documentation

## Installation

```bash
npm install react-cookie-auth
```

## Quick Start

```jsx
import { Auth, AuthModal, LogoutModal, initAuth } from 'react-cookie-auth';
import React from 'react';
import { Provider } from 'react-redux';

// Step 1: Initialize the auth library with your API endpoints
const { store, hooks, actions, selectors } = initAuth({
  apiBaseUrl: 'https://api.example.com',
  loginEndpoint: '/auth/login/', // Your login endpoint
  refreshTokenEndpoint: '/auth/token/refresh/', // Token refresh endpoint
  logoutEndpoint: '/auth/logout/', // Logout endpoint
  refreshTokenInterval: 15 * 60 * 1000, // Refresh every 15 minutes
  maxRetryAttempts: 3, // Max retry attempts on failure
  retryDelay: 1000, // Delay between retries
  onLoginSuccess: user => console.log('User logged in', user),
  onLogoutSuccess: () => console.log('User logged out'),
  onAuthError: error => console.error('Auth error', error),
});

// Step 2: Use in your app component
function App() {
  // Extract hooks for auth operations
  const { useRefreshToken, useLoginMutation, useLogoutMutation } = hooks;
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();
  const [refreshTokenMutation] = useRefreshTokenMutation();

  // Create the refresh function using the hook
  const refreshFunction = useRefreshToken(refreshTokenMutation);

  return (
    <Provider store={store}>
      {/* Step 3: Add Auth wrapper to manage token refresh */}
      <Auth
        refreshFunction={refreshFunction}
        refreshInterval={15 * 60 * 1000}
        onAuthStateChange={isLoggedIn => console.log('Auth state changed', isLoggedIn)}
      >
        {/* Step 4: Use auth modals where needed */}
        <AuthModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSubmit={credentials => loginMutation(credentials)}
          config={{
            title: 'Login to Your Account',
            submitButtonText: 'Login',
          }}
        />

        <LogoutModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onLogout={() => logoutMutation()}
          config={{
            title: 'Logout',
            message: 'Are you sure you want to logout?',
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel',
          }}
        />

        {/* Your app content */}
      </Auth>
    </Provider>
  );
}
```

## Configuration

The `initAuth` function accepts the following configuration options:

| Option               | Type     | Description                                        |
| -------------------- | -------- | -------------------------------------------------- |
| apiBaseUrl           | string   | Base URL for API requests                          |
| loginEndpoint        | string   | Endpoint for login requests                        |
| refreshTokenEndpoint | string   | Endpoint for refresh token requests                |
| logoutEndpoint       | string   | Endpoint for logout requests                       |
| refreshTokenInterval | number   | Interval in milliseconds between token refreshes   |
| maxRetryAttempts     | number   | Maximum number of retry attempts for token refresh |
| retryDelay           | number   | Delay between retry attempts in milliseconds       |
| onLoginSuccess       | function | Callback function when login is successful         |
| onLogoutSuccess      | function | Callback function when logout is successful        |
| onAuthError          | function | Callback function when auth error occurs           |

## Components

### Auth

The main authentication component that handles token refresh logic and Page Visibility API integration.

```jsx
<Auth
  refreshFunction={refreshFunction} // Function to refresh the token
  refreshInterval={refreshInterval} // How often to refresh (ms)
  onAuthStateChange={handleAuthStateChange} // Called when auth state changes
  invalidateAuthTags={invalidateTags} // Optional: refresh cached data
>
  {children}
</Auth>
```

### AuthModal

A modal component for login/signup forms.

```jsx
<AuthModal
  isOpen={isOpen} // Controls visibility
  onClose={handleClose} // Called when modal is closed
  onSubmit={handleSubmit} // Called with form data on submit
  config={{
    // Customize appearance
    title: 'Login',
    submitButtonText: 'Submit',
  }}
/>
```

### LogoutModal

A modal component for confirming logout actions.

```jsx
<LogoutModal
  isOpen={isOpen} // Controls visibility
  onClose={handleClose} // Called when modal is closed
  onLogout={handleLogout} // Called when logout is confirmed
  config={{
    // Customize appearance
    title: 'Logout',
    message: 'Are you sure?',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  }}
/>
```

## API Reference

### Hooks

- `useRefreshToken`: Creates a function to refresh the authentication token
- `useLoginMutation`: RTK Query hook for login requests
- `useLogoutMutation`: RTK Query hook for logout requests
- `useRefreshTokenMutation`: RTK Query hook for refresh token requests

### Actions

- `setUser`: Redux action to set the current user in the store

### Selectors

- `isAuthenticated`: Selector to check if the user is authenticated
- `getUser`: Selector to get the current user from the store

## Security Benefits

- **HTTP-Only Cookies**: Prevents JavaScript from accessing authentication tokens, protecting against XSS attacks
- **Automatic Token Refresh**: Maintains authentication state securely without user intervention
- **Page Visibility Handling**: Prevents refresh token storms after device sleep/wake cycles
- **Secure State Management**: Integrates with Redux for predictable state management
- **No Local Storage**: Avoids storing sensitive auth information in vulnerable browser storage

## Comparison with Other Solutions

| Feature                   | react-cookie-auth | JWT in localStorage | Auth0/Okta  |
| ------------------------- | ----------------- | ------------------- | ----------- |
| XSS Protection            | ✅ High           | ❌ Low              | ✅ High     |
| Automatic Token Refresh   | ✅ Built-in       | ⚠️ Manual           | ✅ Built-in |
| Sleep/Wake Cycle Handling | ✅ Built-in       | ❌ None             | ⚠️ Varies   |
| Implementation Complexity | Medium            | Low                 | High        |
| External Service Required | ❌ No             | ❌ No               | ✅ Yes      |

## Advanced Usage

### Custom Auth Components

You can create custom authentication components by using the hooks and actions provided by the library:

```jsx
import { initAuth } from 'react-cookie-auth';
import { useSelector } from 'react-redux';

const { hooks, actions, selectors } = initAuth({
  // configuration
});

function CustomLoginForm() {
  const [loginMutation, { isLoading, error }] = hooks.useLoginMutation();

  const handleSubmit = async event => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      await loginMutation({ username, password }).unwrap();
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" type="text" placeholder="Username" />
      <input name="password" type="password" placeholder="Password" />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div className="error">{error.message}</div>}
    </form>
  );
}
```

## Troubleshooting

### Common Issues

- **Token Not Refreshing**: Ensure your backend supports the refresh token endpoint and returns proper HTTP-only cookies.
- **Authentication State Lost**: Check if `SameSite` and `Secure` attributes are set correctly on your cookies.

- **CORS Issues**: Your backend needs to allow credentials and have proper CORS headers set.

  ```
  Access-Control-Allow-Credentials: true
  Access-Control-Allow-Origin: https://yourdomain.com
  ```

- **Redux Integration**: If using with existing Redux store, make sure to properly combine the auth reducer with your application's reducers.

## Storybook

This library includes a Storybook setup to showcase and document the components.

### Running Storybook

```bash
npm run storybook
```

This will launch Storybook on http://localhost:6006 where you can browse and interact with all the components.

### Documented Components

- **Auth**: Authentication wrapper component with different configurations
- **AuthModal**: Login form modal with various states and styling options
- **LogoutModal**: Logout confirmation modal with different configurations

### Building Storybook

To build a static version of Storybook for deployment:

```bash
npm run build-storybook
```

## License

MIT
