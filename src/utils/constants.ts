import { AuthLibConfig } from './types'

/**
 * Default refresh token interval: 10 minutes
 */
export const DEFAULT_REFRESH_TIMEOUT = 1000 * 60 * 10

/**
 * Default maximum number of retry attempts for token refresh
 */
export const DEFAULT_MAX_RETRY_ATTEMPTS = 3

/**
 * Default delay between retry attempts: 1 second
 */
export const DEFAULT_RETRY_DELAY = 1000

/**
 * Default authentication API endpoints
 */
export const DEFAULT_LOGIN_ENDPOINT = '/token/'
export const DEFAULT_REFRESH_TOKEN_ENDPOINT = '/token/refresh/'
export const DEFAULT_LOGOUT_ENDPOINT = '/token/invalidate/'

/**
 * Default configuration for the authentication library
 */
export const DEFAULT_AUTH_CONFIG: Partial<AuthLibConfig> = {
  loginEndpoint: DEFAULT_LOGIN_ENDPOINT,
  refreshTokenEndpoint: DEFAULT_REFRESH_TOKEN_ENDPOINT,
  logoutEndpoint: DEFAULT_LOGOUT_ENDPOINT,
  refreshTokenInterval: DEFAULT_REFRESH_TIMEOUT,
  maxRetryAttempts: DEFAULT_MAX_RETRY_ATTEMPTS,
  retryDelay: DEFAULT_RETRY_DELAY,
}

/**
 * Random delay range for refresh token after visibility change (in ms)
 */
export const VISIBILITY_CHANGE_MIN_DELAY = 1000 // 1 second
export const VISIBILITY_CHANGE_MAX_DELAY = 5000 // 5 seconds

/**
 * Helper function to get a random delay between min and max values
 * Used to prevent refresh token storms when a device wakes up
 *
 * @returns Random delay in milliseconds
 */
export const getRandomDelay = (): number => {
  return Math.floor(
    Math.random() *
      (VISIBILITY_CHANGE_MAX_DELAY - VISIBILITY_CHANGE_MIN_DELAY) +
      VISIBILITY_CHANGE_MIN_DELAY,
  )
}

/**
 * Helper function for creating a delay promise
 *
 * @param ms Number of milliseconds to delay
 * @returns Promise that resolves after specified delay
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))
