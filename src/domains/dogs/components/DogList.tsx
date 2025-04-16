/**
 * DogList Component
 * Displays a list of dog profiles
 */

import { useState } from 'react';
import { DogProfile } from '../types';
import { useDogs } from '../hooks/useDogs';
import DogCard from './DogCard';

interface DogListProps {
  onSelectDog?: (dog: DogProfile) => void;
}

export const DogList = ({ onSelectDog }: DogListProps) => {
  const { dogs, loading, error, deleteDog } = useDogs();
  const [selectedDog, setSelectedDog] = useState<DogProfile | null>(null);

  const handleDogClick = (dog: DogProfile) => {
    setSelectedDog(dog);
    if (onSelectDog) {
      onSelectDog(dog);
    }
  };

  const handleDeleteDog = async (id: string) => {
    try {
      await deleteDog(id);
      if (selectedDog?.id === id) {
        setSelectedDog(null);
      }
    } catch (error) {
      console.error('Failed to delete dog:', error);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading dogs...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading dogs: {error.message}
      </div>
    );
  }

  if (dogs.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No dogs found. Add your first dog to get started.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {dogs.map(dog => (
        <DogCard
          key={dog.id}
          dog={dog}
          onClick={handleDogClick}
          onDelete={handleDeleteDog}
        />
      ))}
    </div>
  );
};

export default DogList; 