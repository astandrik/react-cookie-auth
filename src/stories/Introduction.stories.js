import React from 'react';
import { Meta } from '@storybook/blocks';

// This is a special "docs-only" story format
const meta = {
  title: 'Introduction/Welcome',
  tags: ['docs-only'],
  parameters: {
    docsOnly: true,
    docs: {
      page: () => (
        <>
          <h1>React Cookie Auth Library</h1>

          <p>A standalone authentication library for React applications that implements cookie-based authentication with token refresh logic and Page Visibility API integration to prevent refresh token storms.</p>

          <h2>Components</h2>

          <p>This Storybook showcases the following components:</p>

          <h3>Auth Component</h3>

          <p>The <code>Auth</code> component is the core wrapper component that handles token refresh logic and authentication state. It integrates with the Page Visibility API to prevent refresh token storms during device sleep/wake cycles.</p>

          <p><a href="/story/authentication-auth--authenticated">View Auth Stories</a></p>

          <h3>AuthModal Component</h3>

          <p>The <code>AuthModal</code> component provides a configurable login form in a modal dialog. It handles form state, submissions, and error messages.</p>

          <p><a href="/story/authentication-authmodal--default">View AuthModal Stories</a></p>

          <h3>LogoutModal Component</h3>

          <p>The <code>LogoutModal</code> component provides a confirmation dialog for logging out with customizable styling and text.</p>

          <p><a href="/story/authentication-logoutmodal--default">View LogoutModal Stories</a></p>

          <h2>Usage</h2>

          <p>These components work together to provide a complete authentication system:</p>

          <pre>
            <code>{`
<Auth
  refreshFunction={refreshFunction}
  refreshInterval={300000}
  onAuthStateChange={handleAuthStateChange}
>
  <YourAppContent />

  <AuthModal
    isOpen={showLoginModal}
    onClose={handleCloseLoginModal}
    useLoginMutation={useLoginMutation}
    config={{
      /* custom configuration */
    }}
  />

  <LogoutModal
    isOpen={showLogoutModal}
    onClose={handleCloseLogoutModal}
    useLogoutMutation={useLogoutMutation}
    config={{
      /* custom configuration */
    }}
  />
</Auth>
            `}</code>
          </pre>

          <h2>Features</h2>

          <ul>
            <li>Complete authentication flow (login, logout, token refresh)</li>
            <li>Cookie-based authentication</li>
            <li>Redux integration for state management</li>
            <li>Customizable UI components</li>
            <li>TypeScript support</li>
            <li>Page Visibility API implementation to prevent refresh token storms</li>
          </ul>
        </>
      ),
    },
  },
};

export default meta;