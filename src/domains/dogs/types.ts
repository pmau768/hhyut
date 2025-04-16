/**
 * Dogs Domain Types
 */

export type DogActivityType = 'Walk' | 'Run' | 'Training' | 'Play' | 'Rest';

export type DogActivity = {
  id: string;
  type: DogActivityType;
  date: string;
  duration: number; // in minutes
  distance?: number; // in kilometers
  notes?: string;
};

export type DogSize = 'small' | 'medium' | 'large' | 'any';
export type DogEnergy = 'Low' | 'Medium' | 'High';
export type DogTrainingLevel = 'beginner' | 'intermediate' | 'advanced';
export type DogGender = 'male' | 'female';
export type DogPlayStyle = 'Gentle' | 'Moderate' | 'Rough' | 'Varies';

export type DogStats = {
  totalDistance?: number;
  totalActivities?: number;
  avgDuration?: number;
  streak?: number;
};

export type DogProfile = {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: DogGender;
  size: DogSize;
  energyLevel: 'low' | 'moderate' | 'high';
  trainingLevel: DogTrainingLevel;
  profileImage?: string;
  description?: string;
  owner: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  
  // Additional properties used in the codebase
  energy?: DogEnergy;
  isGoodOffLeash?: boolean;
  avatar?: string;
  imageUrl?: string;
  stats?: DogStats;
  playStyle?: DogPlayStyle;
  skills?: string[];
  likes?: string[];
  personality?: string[];
  preferredPlaymates?: {
    sizes?: string[];
  };
  activities?: DogActivity[]; // Activities done by the dog
  behaviorNotes?: string;
  joinedEvents?: string[]; // Events the dog has joined
};

export type DogFormData = Omit<DogProfile, 'id' | 'stats' | 'activities' | 'joinedEvents' | 'createdAt' | 'updatedAt' | 'owner'>; 