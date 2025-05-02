# Auth Library

A standalone authentication library for React applications that implements cookie-based authentication with token refresh logic and Page Visibility API integration to prevent refresh token storms.

## Features

- Complete authentication flow (login, logout, token refresh)
- Cookie-based authentication
- Redux integration for state management
- React components for auth modals
- TypeScript support
- Page Visibility API implementation to prevent refresh token storms after sleep/wake cycles

## Installation

```bash
npm install react-cookie-auth
```

## Quick Start

```jsx
import { Auth, AuthModal, LogoutModal, initAuth } from 'react-cookie-auth';
import React from 'react';

// Initialize the auth library
const { store, hooks, actions, selectors } = initAuth({
  apiBaseUrl: 'https://api.example.com',
  loginEndpoint: '/auth/login/',
  refreshTokenEndpoint: '/auth/token/refresh/',
  logoutEndpoint: '/auth/logout/',
  refreshTokenInterval: 15 * 60 * 1000, // 15 minutes
  maxRetryAttempts: 3,
  retryDelay: 1000,
  onLoginSuccess: user => {
    console.log('User logged in', user);
  },
  onLogoutSuccess: () => {
    console.log('User logged out');
  },
  onAuthError: error => {
    console.error('Auth error', error);
  },
});

// Use in your app
function App() {
  const { useRefreshToken, useLoginMutation, useLogoutMutation } = hooks;
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();
  const [refreshTokenMutation] = useRefreshTokenMutation();

  // Create the refresh function using the hook
  const refreshFunction = useRefreshToken(refreshTokenMutation);

  return (
    <Provider store={store}>
      <Auth
        refreshFunction={refreshFunction}
        refreshInterval={15 * 60 * 1000}
        onAuthStateChange={isLoggedIn => console.log('Auth state changed', isLoggedIn)}
      >
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

| Option               | Type     | Description                                          |
| -------------------- | -------- | ---------------------------------------------------- |
| apiBaseUrl           | string   | The base URL for API requests                        |
| loginEndpoint        | string   | The endpoint for login requests                      |
| refreshTokenEndpoint | string   | The endpoint for refresh token requests              |
| logoutEndpoint       | string   | The endpoint for logout requests                     |
| refreshTokenInterval | number   | The interval in milliseconds between token refreshes |
| maxRetryAttempts     | number   | Maximum number of retry attempts for token refresh   |
| retryDelay           | number   | Delay between retry attempts in milliseconds         |
| onLoginSuccess       | function | Callback function when login is successful           |
| onLogoutSuccess      | function | Callback function when logout is successful          |
| onAuthError          | function | Callback function when auth error occurs             |

## Components

### Auth

The main authentication component that handles token refresh logic and Page Visibility API integration.

```jsx
<Auth
  refreshFunction={refreshFunction}
  refreshInterval={refreshInterval}
  onAuthStateChange={handleAuthStateChange}
  invalidateAuthTags={invalidateTags}
>
  {children}
</Auth>
```

### AuthModal

A modal component for login/signup forms.

```jsx
<AuthModal
  isOpen={isOpen}
  onClose={handleClose}
  onSubmit={handleSubmit}
  config={{
    title: 'Login',
    submitButtonText: 'Submit',
    // other config options
  }}
/>
```

### LogoutModal

A modal component for confirming logout actions.

```jsx
<LogoutModal
  isOpen={isOpen}
  onClose={handleClose}
  onLogout={handleLogout}
  config={{
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

## Storybook

This library includes a Storybook setup to showcase and document the components. Storybook provides an isolated environment for developing and testing UI components, with interactive controls and documentation.

### Running Storybook

To start the Storybook development server:

```bash
npm run storybook
```

This will launch Storybook on http://localhost:6006 where you can browse and interact with all the components.

### Documented Components

The following components have stories:

- **Auth**: Shows the authentication wrapper component with different configurations
- **AuthModal**: Shows the login form modal with various states (default, loading, error) and styling options
- **LogoutModal**: Shows the logout confirmation modal with different configurations

### Interactive Documentation

Each component in Storybook includes:

- **Controls**: Modify component props in real-time to see how they affect rendering
- **Actions**: View callbacks triggered by user interactions
- **Docs**: Detailed documentation with usage examples and prop descriptions

### Building Storybook

To build a static version of Storybook for deployment:

```bash
npm run build-storybook
```

This creates a static web application in the `storybook-static` directory that can be deployed to any web server.

## License

MIT
