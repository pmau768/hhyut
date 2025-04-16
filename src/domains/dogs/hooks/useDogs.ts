/**
 * Dogs hooks for managing dog profiles
 */

import { useState, useEffect, useCallback } from 'react';
import { DogProfile, DogActivity } from '../types';
import { 
  getDogs,
  setDogs as saveDogs,
  getDogById,
  createDog as createDogInStorage,
  updateDog as updateDogInStorage,
  deleteDog as deleteDogInStorage,
  addDogActivity as addDogActivityInStorage
} from '../services/dogStorage';

/**
 * Custom hook for working with dog profiles
 * @returns Dog operations and state
 */
export const useDogs = () => {
  const [dogs, setDogs] = useState<DogProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load dogs from storage on initial render
  useEffect(() => {
    try {
      const storedDogs = getDogs();
      setDogs(storedDogs);
      setError(null);
    } catch (err) {
      console.error('Error loading dogs:', err);
      setError(err instanceof Error ? err : new Error('Failed to load dogs'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Save dogs to storage whenever they change
  useEffect(() => {
    if (!loading && dogs.length > 0) {
      try {
        saveDogs(dogs);
      } catch (err) {
        console.error('Error saving dogs:', err);
      }
    }
  }, [dogs, loading]);

  // Get a specific dog by ID
  const getDog = useCallback((id: string): DogProfile | undefined => {
    return dogs.find(dog => dog.id === id);
  }, [dogs]);

  // Create a new dog
  const createDog = useCallback(async (dog: Omit<DogProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<DogProfile> => {
    try {
      const newDog = createDogInStorage(dog);
      setDogs(prevDogs => [...prevDogs, newDog]);
      return newDog;
    } catch (err) {
      console.error('Error creating dog:', err);
      throw err instanceof Error ? err : new Error('Failed to create dog');
    }
  }, []);

  // Update an existing dog
  const updateDog = useCallback(async (id: string, updates: Partial<DogProfile>): Promise<DogProfile | undefined> => {
    try {
      const updatedDog = updateDogInStorage(id, updates);
      if (updatedDog) {
        setDogs(prevDogs => 
          prevDogs.map(dog => dog.id === id ? updatedDog : dog)
        );
      }
      return updatedDog;
    } catch (err) {
      console.error('Error updating dog:', err);
      throw err instanceof Error ? err : new Error('Failed to update dog');
    }
  }, []);

  // Delete a dog
  const deleteDog = useCallback(async (id: string): Promise<boolean> => {
    try {
      const success = deleteDogInStorage(id);
      if (success) {
        setDogs(prevDogs => prevDogs.filter(dog => dog.id !== id));
      }
      return success;
    } catch (err) {
      console.error('Error deleting dog:', err);
      throw err instanceof Error ? err : new Error('Failed to delete dog');
    }
  }, []);

  // Add an activity to a dog
  const addDogActivity = useCallback(async (
    dogId: string, 
    activity: Omit<DogActivity, 'id'>
  ): Promise<DogProfile | undefined> => {
    try {
      const updatedDog = addDogActivityInStorage(dogId, activity);
      if (updatedDog) {
        setDogs(prevDogs => 
          prevDogs.map(dog => dog.id === dogId ? updatedDog : dog)
        );
      }
      return updatedDog;
    } catch (err) {
      console.error('Error adding activity:', err);
      throw err instanceof Error ? err : new Error('Failed to add activity');
    }
  }, []);

  return {
    dogs,
    loading,
    error,
    getDog,
    createDog,
    updateDog,
    deleteDog,
    addDogActivity
  };
};

export default useDogs; 