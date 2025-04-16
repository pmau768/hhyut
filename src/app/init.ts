/**
 * App Initialization
 * Handles setting up the application on startup
 */

import { getStorageItem, hasStorageItem, STORAGE_KEYS } from '@/lib/services/storage';
import { getDogs, setDogs } from '@/domains/dogs/services/dogStorage';

/**
 * Initialize the application
 * This should be called early in the app lifecycle
 */
export const initializeApp = () => {
  console.log('Initializing application...');
  
  // Initialize local storage with default data
  initializeLocalStorage();
  
  // Add any other initialization tasks here
  // e.g., setting up listeners, initializing third party services, etc.
  
  console.log('Application initialization complete');
};

/**
 * Initialize local storage with default data
 */
const initializeLocalStorage = () => {
  console.log('Initializing localStorage with default data...');
  
  // Initialize Dogs
  if (!hasStorageItem(STORAGE_KEYS.DOGS)) {
    const defaultDogs = getDogs();
    setDogs(defaultDogs);
    console.log('Dogs storage initialized with default data');
  }
  
  // Initialize other storage items as needed...
  
  console.log('localStorage initialization complete!');
};

export default initializeApp; 