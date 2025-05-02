# React Authentication System Documentation

## Overview

This document provides a comprehensive overview of our React application's authentication system, with a specific focus on how localStorage is used for persistence. The system implements a token-based authentication approach with automatic refresh capabilities to maintain user sessions.

## Key Files

- **src/state/authSlice.ts**: Manages authentication state and localStorage persistence
- **src/hooks/useRefreshToken.ts**: Handles token refresh logic and lastRefreshTime tracking
- **src/components/Auth.tsx**: Authentication component managing refresh cycles

## LocalStorage Usage

The authentication system uses localStorage to persist two key pieces of information:

1. **User Data** (`CURRENT_USER` key): Stores the authenticated user information
2. **Last Refresh Time** (`LAST_REFRESH_TIME` key): Tracks when tokens were last refreshed

### 1. Initial User State Loading

When the application initializes, the auth state is populated from localStorage:

```typescript
// From authSlice.ts
const initialState: AuthState = {
  user: getItemFromStorage<User>(LocalStorageKeys.CURRENT_USER) || null,
};
```

This allows the application to maintain authentication state across page reloads and browser sessions.

### 2. Token Refresh Logic

The token refresh mechanism is implemented in `useRefreshToken.ts` and follows these rules:

```typescript
// Check last refresh time from localStorage
const lastRefreshTime = getItemFromStorage<number>(LocalStorageKeys.LAST_REFRESH_TIME);
const currentTime = Date.now();

// Only refresh if:
// 1. There's no lastRefreshTime in localStorage, OR
// 2. Enough time has passed since the last refresh (90% of the refresh interval)
if (!lastRefreshTime || currentTime - lastRefreshTime > refreshInterval * 0.9) {
  // Perform token refresh...
}
```

When a token refresh is successful:

```typescript
// Update last refresh time in localStorage
setItemToStorage(LocalStorageKeys.LAST_REFRESH_TIME, currentTime);
```

**Note**: The timestamp is stored **before** the API call completes, which is one area identified for potential improvement.

### 3. Logout Behavior

When a user logs out, both localStorage entries are removed:

```typescript
// On logout (user is null), remove both user and lastRefreshTime from localStorage
localStorage.removeItem(LocalStorageKeys.CURRENT_USER);
localStorage.removeItem(LocalStorageKeys.LAST_REFRESH_TIME);
```

This ensures that no authentication data persists after logout.

### 4. Auth Component Refresh Cycle

The `Auth.tsx` component manages token refresh cycles:

1. On initial mount, it performs a token refresh
2. It sets up an interval to periodically refresh tokens
3. It uses the Page Visibility API to handle browser sleep/wake cycles:
   - Pauses refresh when page is hidden (browser tab inactive or device sleep)
   - Performs a single refresh when page becomes visible again
   - Uses random delays to prevent multiple tabs from refreshing simultaneously

```typescript
// Initial refresh when component mounts
refreshFunction();

// Set up the normal refresh interval
setupRefreshInterval();
```

## Potential Improvements

Based on code analysis, the following improvements could enhance the authentication system:

### 1. Update Timestamp After API Call Completion

Currently, the `lastRefreshTime` is set to `currentTime` before the API call completes:

```typescript
// Current implementation
const currentTime = Date.now();
// API call happens here
setItemToStorage(LocalStorageKeys.LAST_REFRESH_TIME, currentTime);
```

Improvement: Update the timestamp only after successful API response to ensure accuracy:

```typescript
// Improved implementation
const response = await refreshTokenMutation().unwrap();
if (response && response.user) {
  dispatch(setUser(response.user));
  // Only update timestamp after successful API call
  setItemToStorage(LocalStorageKeys.LAST_REFRESH_TIME, Date.now());
  success = true;
}
```

### 2. Add Cross-Tab Communication

The current implementation doesn't synchronize authentication state across multiple tabs. Adding a mechanism to detect logout events across tabs would improve user experience:

```typescript
// Example using the Storage event
window.addEventListener('storage', event => {
  if (event.key === LocalStorageKeys.CURRENT_USER && !event.newValue) {
    // Another tab triggered logout, synchronize this tab
    dispatch(setUser(null));
    // Redirect to login page if needed
  }
});
```

### 3. Add Token Expiration Time Tracking

Currently, the system doesn't track token expiration explicitly. Adding this would provide more accurate refresh timing:

```typescript
// Store token expiration alongside lastRefreshTime
setItemToStorage(LocalStorageKeys.TOKEN_EXPIRY, currentTime + expiryDuration);

// Check against expiry rather than fixed interval
const tokenExpiry = getItemFromStorage<number>(LocalStorageKeys.TOKEN_EXPIRY);
if (!tokenExpiry || currentTime > tokenExpiry - bufferTime) {
  // Refresh token before it expires
}
```

### 4. Add User Data Validation

The system currently doesn't validate the structure of user data retrieved from localStorage. Adding validation would enhance security:

```typescript
const validateUser = (user: any): user is User => {
  return (
    user &&
    typeof user === 'object' &&
    typeof user.id === 'string' &&
    typeof user.email === 'string'
    // Add additional required fields
  );
};

const storedUser = getItemFromStorage(LocalStorageKeys.CURRENT_USER);
const user = validateUser(storedUser) ? storedUser : null;
```

### 5. Security Considerations: localStorage vs. HttpOnly Cookies

**Current Approach (localStorage):**

- Pros:
  - Easy to implement and access from JavaScript
  - Persists across browser sessions
- Cons:
  - Vulnerable to XSS attacks
  - No automatic expiration
  - No domain restrictions
  - Accessible by all JavaScript in the same origin

**HttpOnly Cookies Alternative:**

- Pros:
  - Not accessible via JavaScript (protection against XSS)
  - Can be restricted by domain, path, and HTTPS
  - Can be set to expire automatically
  - Can use SameSite attribute for CSRF protection
- Cons:
  - Requires server-side implementation
  - Sent with every request to the same domain

**Recommendation:**
Consider switching to HttpOnly cookies for storing authentication tokens, while keeping user profile data in localStorage or application state. This provides a better balance of security and convenience.

## Conclusion

The current authentication system effectively manages user sessions using localStorage for persistence, with automatic token refresh capabilities to maintain authentication state. The identified improvements would enhance security, reliability, and cross-tab synchronization of the authentication system.

## Complete Authentication Flow

The authentication system follows these key workflows:

### Login Flow

1. User enters credentials in the AuthModal component
2. Login API call is made using the useLoginMutation hook
3. On successful login:
   - User data is stored in Redux state
   - User data is persisted to localStorage
   - Last refresh time is set in localStorage
   - onLoginSuccess callback is triggered (if provided)
4. On failed login:
   - Error message is displayed to the user
   - Store and localStorage remain unchanged

### Logout Flow

1. User confirms logout in the LogoutModal component
2. Logout API call is made using the useLogoutMutation hook
3. On successful logout:
   - User data is removed from Redux state
   - User data is removed from localStorage
   - Last refresh time is removed from localStorage
   - onLogoutSuccess callback is triggered (if provided)
4. On failed logout:
   - Error is logged but modal still closes (to prevent trapping users)
   - onLogoutError callback is triggered (if provided)
   - User is still logged out locally to maintain consistency

### Token Refresh Flow

1. Auth component checks for token refresh conditions:
   - On initial mount
   - After visibility change (tab/window becomes active)
   - On configured interval (default is 5 minutes)
2. Token refresh is performed if:
   - User is currently authenticated
   - No lastRefreshTime exists in localStorage OR
   - Enough time has passed since last refresh (90% of refresh interval)
3. On successful refresh:
   - User data is updated in Redux state
   - Last refresh time is updated in localStorage
4. On failed refresh:
   - If server responds with authentication error, user is logged out
   - For other errors, the system will retry on the next cycle

## Error Handling and Edge Cases

The authentication system handles several error scenarios:

### Authentication Errors

1. **Invalid Credentials**: Displayed to the user with clear error messages
2. **Expired Tokens**: Triggers automatic logout and redirects to login
3. **Network Errors**: Handled with appropriate error messages while preserving state
4. **Server Errors**: Displayed with generic error message to avoid exposing backend details

### Edge Cases

1. **Multiple Tabs**:

   - Each tab maintains its own refresh cycle
   - Staggered refresh times to prevent server overload
   - Potential improvement: Cross-tab communication for synchronized state

2. **Sleep/Wake Cycles**:

   - Uses Page Visibility API to pause refresh during sleep
   - Immediate refresh when device wakes to ensure valid session

3. **Logout Failures**:

   - Modal still closes on errors to prevent user from being trapped
   - Local state is still cleared even if server request fails

4. **Refresh Timeouts**:
   - Handled gracefully with error logging
   - System continues to function and will retry on next cycle

## Testing Scenarios with Auth.stories.tsx

The library includes a comprehensive set of 12 testing scenarios in `Auth.stories.tsx` that cover all aspects of the authentication system. These scenarios use mocked implementations of the authentication hooks to simulate various states and behaviors.

### Testing Scenarios Overview

1. **Unauthenticated State**

   - Tests the component's fallback content when user is not authenticated
   - Verifies proper rendering of unauthenticated UI

2. **Authenticated State**

   - Tests the component's protected content when user is authenticated
   - Verifies user data in localStorage and proper rendering of authenticated UI

3. **Login Success**

   - Demonstrates a successful login flow
   - Tests state changes in Redux and localStorage after login
   - Verifies callbacks and UI updates

4. **Login Failure**

   - Shows login flow with authentication errors
   - Tests error handling and error message display
   - Verifies state remains unchanged after failed login

5. **Login Loading**

   - Demonstrates the loading state during login
   - Tests loading indicators and disabled UI elements

6. **Logout Success**

   - Shows successful logout flow
   - Tests state changes in Redux and localStorage after logout
   - Verifies callbacks and UI updates

7. **Logout Failure**

   - Shows logout flow with server errors
   - Tests error handling while ensuring user isn't trapped
   - Verifies local state is cleared even with server errors

8. **Token Refresh Success**

   - Demonstrates successful token refresh
   - Tests refresh timing logic and localStorage updates

9. **Token Refresh Failure**

   - Shows token refresh failure
   - Tests error handling during refresh
   - Verifies system continues to function

10. **Token Refresh Timeout**

    - Demonstrates a token refresh that times out after 3 seconds
    - Tests timeout handling and error recovery

11. **localStorage Integration**

    - Shows integration with localStorage
    - Tests manual operations on localStorage and their effect on the auth state
    - Demonstrates persistence and synchronization

12. **Network Error Handling**
    - Shows how the component handles network errors during token refresh
    - Tests network error detection and recovery

### Key Test Implementation Features

1. **Mock localStorage**

   - The test suite implements a mock localStorage with action logging
   - Allows visual inspection of localStorage changes
   - Helps debug state persistence issues

2. **Mock Authentication Hooks**

   - createMockLoginMutation, createMockLogoutMutation, and createMockRefreshTokenMutation
   - Simulate various API responses and states (loading, success, error)
   - Allow testing without actual API endpoints

3. **Visual LocalStorage Display**

   - A LocalStorageDisplay component shows real-time changes
   - Makes state changes visible during testing

4. **Mock Redux Store**
   - createMockStore configures a Redux store with controlled initial state
   - Simulates different authentication states

### Using These Scenarios During Development

These testing scenarios provide a comprehensive testing framework for the authentication system:

1. **During Feature Development**:

   - Use these scenarios to understand expected behavior
   - Modify and extend them to test new features
   - Ensure new code doesn't break existing scenarios

2. **For Debugging**:

   - Run specific scenarios to isolate issues
   - Use action logs to trace the execution flow
   - Examine localStorage changes to debug persistence issues

3. **For Component Integration**:

   - Use as reference for how to properly integrate authentication components
   - Ensure your components handle all authentication states correctly

4. **For Edge Case Testing**:

   - The scenarios cover common edge cases like network errors and timeouts
   - Use as a basis for testing additional edge cases specific to your application

5. **For Documentation**:
   - The scenarios serve as living documentation of authentication behavior
   - New team members can use them to understand the authentication system

To run these test scenarios, use Storybook:

```bash
npm run storybook
```

Then navigate to the "Authentication/Auth" section to explore each scenario.
