import { AuthErrorType } from './types';

/**
 * Gets a user-friendly error message based on the authentication error type
 *
 * @param errorType The authentication error type
 * @returns A user-friendly error message
 */
export const getAuthErrorMessage = (errorType: AuthErrorType): string => {
  switch (errorType) {
    case AuthErrorType.INVALID_CREDENTIALS:
      return 'Invalid username or password';
    case AuthErrorType.ACCOUNT_DISABLED:
      return 'This account has been disabled';
    case AuthErrorType.ACCOUNT_LOCKED:
      return 'This account has been locked. Please contact support';
    case AuthErrorType.TOKEN_EXPIRED:
      return 'Your session has expired. Please login again';
    case AuthErrorType.TOKEN_INVALID:
      return 'Invalid authentication token';
    case AuthErrorType.TOKEN_BLACKLISTED:
      return 'This session has been invalidated';
    case AuthErrorType.SYSTEM_ERROR:
      return 'A system error occurred. Please try again later';
    default:
      return 'An unknown authentication error occurred';
  }
};

/**
 * Determines if an error is an authentication error
 *
 * @param error The error object
 * @returns True if the error is an authentication error
 */
export const isAuthError = (error: any): boolean => {
  if (!error || !error.data || !error.data.error_type) {
    return false;
  }

  return Object.values(AuthErrorType).includes(error.data.error_type as AuthErrorType);
};

/**
 * Gets the auth error type from an error response
 *
 * @param error The error object
 * @returns The authentication error type or undefined
 */
export const getAuthErrorType = (error: any): AuthErrorType | undefined => {
  if (!error || !error.data || !error.data.error_type) {
    return undefined;
  }

  return error.data.error_type as AuthErrorType;
};
