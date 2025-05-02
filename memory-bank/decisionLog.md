# Decision Log

This file records architectural and implementation decisions using a list format.
2025-05-02 17:37:58 - Log of updates made.
2025-05-02 22:46:30 - Added testing decisions and implementation details.
2025-05-03 01:45:10 - Added automated publishing workflow details.

-

## Decision

- The authentication system uses localStorage for storing tokens and refresh time
- Token refresh is triggered when lastRefreshTime is absent or expired
- Timer-based token refresh mechanism is implemented
- Comprehensive testing scenarios are implemented in Auth.stories.tsx
- Mock implementations of auth hooks are used for testing
- Automated GitHub workflow for NPM package publishing triggered by version changes in package.json

## Rationale

- localStorage provides persistence across browser sessions
- Refresh logic prevents token expiration during active sessions
- Token-based authentication provides secure and stateless authentication
- Comprehensive testing scenarios ensure all edge cases are covered
- Visual localStorage representation helps developers track state changes
- Storybook provides an interactive environment for testing and documentation
- Automated publishing workflow reduces manual steps and potential errors in the release process
- Version-change detection ensures package version, git tags, and GitHub releases are always in sync
- Automated changelog generation maintains clean and consistent release history

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
- GitHub workflow (.github/workflows/npm-publish.yml) implemented with:
  - Triggers on pushes to main branch, tag creation, and manual dispatch
  - "detect-version-change" job that checks if package.json version has changed
  - Conditional execution of subsequent jobs based on version change detection
  - Automatic git tag creation for new versions
  - Automatic GitHub release creation with changelog generation
  - Consistent NPM package publishing only when version changes
