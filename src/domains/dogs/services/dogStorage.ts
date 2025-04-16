/**
 * Dog Storage Service
 * Handles persistence of dog profiles using localStorage
 */

import { DogProfile } from '../types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/lib/services/storage';

// Mock data for initial state
const DEFAULT_DOGS: DogProfile[] = [
  {
    id: "dog1",
    name: "Max",
    breed: "Golden Retriever",
    age: 3,
    gender: "male",
    size: "large",
    energyLevel: "high",
    trainingLevel: "intermediate",
    profileImage: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=1000",
    description: "Friendly and energetic golden retriever who loves swimming and playing fetch.",
    owner: "user1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    energy: "High",
    isGoodOffLeash: true,
    avatar: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=1000",
    imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=1000",
    stats: {
      totalDistance: 78.5,
      totalActivities: 42,
      avgDuration: 45,
      streak: 5
    },
    playStyle: "Moderate",
    skills: ["Sit", "Stay", "Fetch", "Swim"],
    likes: ["Water", "Tennis balls", "Car rides"],
    personality: ["Friendly", "Energetic", "Playful"],
    preferredPlaymates: {
      sizes: ["medium", "large"]
    },
    activities: [
      {
        id: "act1",
        type: "Walk",
        date: "2023-07-15",
        duration: 45,
        distance: 3.2,
        notes: "Evening walk in the park"
      },
      {
        id: "act2",
        type: "Training",
        date: "2023-07-14",
        duration: 30,
        notes: "Practiced recall and stay commands"
      }
    ],
    joinedEvents: ["event1", "event3"]
  },
  {
    id: "dog2",
    name: "Bella",
    breed: "Beagle",
    age: 2,
    gender: "female",
    size: "medium",
    energyLevel: "moderate",
    trainingLevel: "beginner",
    profileImage: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=1000",
    description: "Sweet and curious beagle who loves to follow her nose on adventures.",
    owner: "user1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    energy: "Medium",
    isGoodOffLeash: false,
    avatar: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=1000",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=1000",
    stats: {
      totalDistance: 45.2,
      totalActivities: 28,
      avgDuration: 35,
      streak: 3
    },
    playStyle: "Gentle",
    skills: ["Sit", "Paw"],
    likes: ["Treats", "Sniffing", "Short walks"],
    personality: ["Curious", "Sweet", "Stubborn"],
    preferredPlaymates: {
      sizes: ["small", "medium"]
    },
    activities: [
      {
        id: "act3",
        type: "Play",
        date: "2023-07-13",
        duration: 25,
        notes: "Played at the dog park"
      }
    ],
    joinedEvents: ["event2"]
  }
];

/**
 * Get all dog profiles
 * @returns Array of dog profiles
 */
export const getDogs = (): DogProfile[] => {
  return getStorageItem<DogProfile[]>(STORAGE_KEYS.DOGS, DEFAULT_DOGS);
};

/**
 * Save all dog profiles
 * @param dogs Array of dog profiles to save
 * @returns true if successful
 */
export const setDogs = (dogs: DogProfile[]): boolean => {
  return setStorageItem(STORAGE_KEYS.DOGS, dogs);
};

/**
 * Get a specific dog profile by ID
 * @param id Dog ID
 * @returns Dog profile or undefined if not found
 */
export const getDogById = (id: string): DogProfile | undefined => {
  const dogs = getDogs();
  return dogs.find(dog => dog.id === id);
};

/**
 * Create a new dog profile
 * @param dog Dog profile data (without ID)
 * @returns The created dog profile with ID
 */
export const createDog = (dog: Omit<DogProfile, 'id' | 'createdAt' | 'updatedAt'>): DogProfile => {
  // Generate a new dog with required fields
  const newDog: DogProfile = {
    ...dog,
    id: `dog_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    joinedEvents: dog.joinedEvents || [],
    activities: dog.activities || []
  };
  
  const dogs = getDogs();
  setDogs([...dogs, newDog]);
  return newDog;
};

/**
 * Update an existing dog profile
 * @param id Dog ID
 * @param updates Partial dog profile updates
 * @returns Updated dog profile or undefined if not found
 */
export const updateDog = (id: string, updates: Partial<DogProfile>): DogProfile | undefined => {
  const dogs = getDogs();
  const index = dogs.findIndex(dog => dog.id === id);
  
  if (index === -1) return undefined;
  
  const updatedDog = {
    ...dogs[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  dogs[index] = updatedDog;
  setDogs(dogs);
  return updatedDog;
};

/**
 * Delete a dog profile
 * @param id Dog ID
 * @returns true if successful, false if dog not found
 */
export const deleteDog = (id: string): boolean => {
  const dogs = getDogs();
  const filteredDogs = dogs.filter(dog => dog.id !== id);
  
  if (filteredDogs.length === dogs.length) return false;
  
  return setDogs(filteredDogs);
};

/**
 * Add an activity to a dog profile
 * @param dogId Dog ID
 * @param activity Activity to add
 * @returns Updated dog or undefined if dog not found
 */
export const addDogActivity = (dogId: string, activity: Omit<DogActivity, 'id'>): DogProfile | undefined => {
  const dog = getDogById(dogId);
  if (!dog) return undefined;
  
  const newActivity = {
    ...activity,
    id: `act_${Date.now()}`
  };
  
  const activities = [...(dog.activities || []), newActivity];
  const totalDistance = activities.reduce((sum, act) => sum + (act.distance || 0), 0);
  const avgDuration = activities.length > 0 
    ? activities.reduce((sum, act) => sum + act.duration, 0) / activities.length 
    : 0;
  
  return updateDog(dogId, {
    activities,
    stats: {
      ...(dog.stats || {}),
      totalActivities: activities.length,
      totalDistance,
      avgDuration
    }
  });
}; 