# Decision Log

This file records architectural and implementation decisions using a list format.
2025-05-02 17:37:58 - Log of updates made.
2025-05-02 22:46:30 - Added testing decisions and implementation details.

-

## Decision

- The authentication system uses localStorage for storing tokens and refresh time
- Token refresh is triggered when lastRefreshTime is absent or expired
- Timer-based token refresh mechanism is implemented
- Comprehensive testing scenarios are implemented in Auth.stories.tsx
- Mock implementations of auth hooks are used for testing

## Rationale

- localStorage provides persistence across browser sessions
- Refresh logic prevents token expiration during active sessions
- Token-based authentication provides secure and stateless authentication
- Comprehensive testing scenarios ensure all edge cases are covered
- Visual localStorage representation helps developers track state changes
- Storybook provides an interactive environment for testing and documentation

## Implementation Details

- authSlice.ts manages the auth state and localStorage persistence
- useRefreshToken.ts handles token refresh logic and tracks lastRefreshTime
- Auth.tsx component manages the refresh cycles
- Auth.stories.tsx implements 12 comprehensive testing scenarios:
  - Basic states (authenticated/unauthenticated)
  - Login flows (success/failure/loading)
  - Logout flows (success/failure)
  - Token refresh scenarios (success/failure/timeout)
  - localStorage integration
  - Network error handling
- Mock implementations simulate API responses without actual endpoints
- Visual localStorage component helps debug persistence issues
