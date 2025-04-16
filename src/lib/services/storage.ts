/**
 * Core Storage Service
 * Provides utilities for interacting with localStorage with type safety and error handling
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
    if (!stored) return fallback;
    return JSON.parse(stored) as T;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return fallback;
  }
};

/**
 * Sets an item in localStorage
 * @param key The key to set
 * @param value The value to store
 * @returns boolean indicating success
 */
export const setStorageItem = <T>(key: string, value: T): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error storing ${key} in localStorage:`, error);
    return false;
  }
};

/**
 * Removes an item from localStorage
 * @param key The key to remove
 * @returns boolean indicating success
 */
export const removeStorageItem = (key: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

/**
 * Clears all items from localStorage
 * @returns boolean indicating success
 */
export const clearStorage = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Checks if item exists in localStorage
 * @param key The key to check
 * @returns boolean indicating if the key exists
 */
export const hasStorageItem = (key: string): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(key) !== null;
};

// Storage keys used throughout the application
export const STORAGE_KEYS = {
  DOGS: 'woofer_dogs',
  EVENTS: 'woofer_events',
  USER: 'woofer_user',
  DOG_PARKS: 'woofer_dog_parks',
  MEETUPS: 'woofer_meetups',
  TRAINING_CLASSES: 'woofer_training_classes',
  JOINED_EVENTS: 'joinedEvents',
  STREAK_DATA: 'streakData',
  WEEKLY_SUMMARY: 'weeklySummary'
}; 