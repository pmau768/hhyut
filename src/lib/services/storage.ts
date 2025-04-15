/**
 * Storage service for managing localStorage operations
 * This centralizes all storage interactions to ensure consistency across the app
 */

/**
 * Gets an item from localStorage
 * @param key The key to retrieve
 * @param fallback The fallback value if the key doesn't exist
 * @returns The stored value or the fallback
 */
export const getStorageItem = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return fallback;
  }
};

/**
 * Sets an item in localStorage
 * @param key The key to set
 * @param value The value to store
 * @returns void
 */
export const setStorageItem = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error storing ${key} in localStorage:`, error);
  }
};

/**
 * Removes an item from localStorage
 * @param key The key to remove
 * @returns void
 */
export const removeStorageItem = (key: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

/**
 * Clears all items from localStorage
 * @returns void
 */
export const clearStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Storage keys used throughout the application
export const STORAGE_KEYS = {
  EVENTS: 'events',
  DOGS: 'dogs',
  USER: 'user',
  SETTINGS: 'settings',
  JOINED_EVENTS: 'joinedEvents',
  STREAK_DATA: 'streakData',
  WEEKLY_SUMMARY: 'weeklySummary'
}; 