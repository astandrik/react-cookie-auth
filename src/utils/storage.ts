import { LocalStorageKeys } from './types'

/**
 * Checks if code is running in a browser environment
 */
const IS_SERVER = typeof window === 'undefined'

/**
 * Retrieves an item from localStorage and parses it from JSON
 *
 * @param key The localStorage key to retrieve
 * @returns The parsed value, or null if not found or on server
 */
export const getItemFromStorage = <T>(key: LocalStorageKeys): T | null => {
  if (IS_SERVER) {
    return null
  }

  const item = localStorage.getItem(key)

  try {
    return item ? (JSON.parse(item) as T) : null
  } catch (e) {
    console.error(`Error parsing item from localStorage: ${key}`, e)
    return null
  }
}

/**
 * Stores an item in localStorage after converting it to JSON
 *
 * @param key The localStorage key to store under
 * @param value The value to store
 */
export const setItemToStorage = <T>(key: LocalStorageKeys, value: T): void => {
  if (IS_SERVER) return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error(`Error setting item to localStorage: ${key}`, e)
  }
}

/**
 * Removes an item from localStorage
 *
 * @param key The localStorage key to remove
 */
export const removeItemFromStorage = (key: LocalStorageKeys): void => {
  if (IS_SERVER) return

  try {
    localStorage.removeItem(key)
  } catch (e) {
    console.error(`Error removing item from localStorage: ${key}`, e)
  }
}

/**
 * Clears all authentication-related items from localStorage
 */
export const clearAuthStorage = (): void => {
  if (IS_SERVER) return

  try {
    Object.values(LocalStorageKeys).forEach((key) => {
      localStorage.removeItem(key)
    })
  } catch (e) {
    console.error('Error clearing auth storage', e)
  }
}
