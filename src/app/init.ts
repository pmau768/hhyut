/**
 * App Initialization
 * Handles setting up the application on startup
 */

import { getStorageItem, hasStorageItem, STORAGE_KEYS } from '@/lib/services/storage';
import { getDogs, setDogs } from '@/domains/dogs/services/dogStorage';
import { getUser, setUser } from '@/lib/localStorage';
import { User } from '@/lib/types';

// Default user for demo purposes
const DEFAULT_USER: User = {
  id: "user1",
  email: "demo@example.com",
  name: "Demo User",
  avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=200",
  bio: "Dog lover with two energetic pups. I enjoy hiking and training with my dogs.",
  location: "Portland, OR",
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    newsletterSubscription: false
  },
  createdAt: new Date().toISOString(),
};

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
  
  // Initialize User
  if (!hasStorageItem(STORAGE_KEYS.USER)) {
    setUser(DEFAULT_USER);
    console.log('User storage initialized with default data');
  }
  
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