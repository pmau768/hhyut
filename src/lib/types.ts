import { ReactNode } from 'react';

// StreakData type for activity tracking
export type StreakData = {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakHistory: Array<{
    date: string;
    completed: boolean;
  }>;
};

export type DogProfile = {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: 'male' | 'female';
  size: 'small' | 'medium' | 'large';
  energyLevel: 'low' | 'moderate' | 'high';
  trainingLevel: 'beginner' | 'intermediate' | 'advanced';
  profileImage?: string;
  description?: string;
  owner: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  
  // Additional properties used in the codebase
  energy?: 'Low' | 'Medium' | 'High';
  isGoodOffLeash?: boolean;
  avatar?: string;
  imageUrl?: string;
  stats?: {
    totalDistance?: number;
    totalActivities?: number;
    avgDuration?: number;
    streak?: number;
  };
  playStyle?: 'Gentle' | 'Moderate' | 'Rough' | 'Varies';
  skills?: string[];
  likes?: string[];
  preferredPlaymates?: {
    sizes?: string[];
  };
  activities?: any[]; // Activities done by the dog
  behaviorNotes?: string;
  duration?: number;
  joinedEvents?: string[]; // Events the dog has joined
  personality?: string[]; // Dog personality traits
};

export type DogFormData = Omit<DogProfile, 'id' | 'stats' | 'activities' | 'joinedEvents'>;

export type ActivityType = 'Walk' | 'Run' | 'Training' | 'Play' | 'Rest';

export type DogActivity = {
  id: string;
  type: ActivityType;
  date: string;
  duration: number; // in minutes
  distance?: number; // in kilometers
  notes?: string;
};

export type EventCategory = 'PLAYDATE' | 'TRAINING' | 'DOG_PARK' | 'COMPETITION' | 'ADOPTION' | 'OTHER' | 
  // Additional categories used in the codebase
  'Run' | 'Training' | 'Social' | 'Playdate' | 'Other' | 'Walk';

export type EventStatus = 'Open' | 'Full' | 'Cancelled' | 'Completed';

export type EventHost = {
  id: string;
  name: string;
  profileImage?: string;
  bio?: string;
  avatar?: string;
  imageUrl?: string;
};

export type EventAttendee = {
  id: string;
  name: string;
  avatar: string;
  imageUrl?: string; // Alias for avatar for backward compatibility
  dogName?: string;
  joinedAt?: string;
};

export type EventComment = {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  userImageUrl?: string; // Alias for backward compatibility
  content: string;
  createdAt: string;
  likes?: number;
  replies?: EventComment[];
};

export type EventReaction = {
  id: string;
  type: string;
  userId: string;
  userName: string;
  timestamp: string;
};

// New type for dog ability requirements
export type DogAbility = 'Running' | 'Sprinting' | 'Climbing' | 'Swimming' | 'Jumping' | 'OffLeash' | 'Socialization' | 'BasicCommands' | 'AdvancedCommands';

// New type for difficulty level
export type DifficultyLevel = 'Easy' | 'Moderate' | 'Challenging';

// New type for breed size
export type DogSize = 'small' | 'medium' | 'large' | 'any';

export type DogPlayStyle = 'Gentle' | 'Moderate' | 'Rough' | 'Varies';
export type DogInteractionPreference = 'One-on-one' | 'Small groups' | 'Large groups' | 'Any';
export type DogPersonality = 'Shy' | 'Friendly' | 'Independent' | 'Dominant' | 'Submissive';

export type Event = {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  location: string | {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  date: Date | string;
  time?: string;
  category: EventCategory;
  host?: EventHost;
  requirements?: EventRequirements;
  attendeeCount?: number;
  tags?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  
  // Additional properties used in the codebase
  avatar?: string;
  imageUrl?: string;
  maxAttendees?: number;
  attendees?: EventAttendee[];
  status?: EventStatus;
  gallery?: string[];
  comments?: EventComment[];
  distance?: number;
  
  // Dog compatibility properties
  difficultyLevel?: DifficultyLevel;
  requiredAbilities?: DogAbility[];
  suitableEnergyLevels?: string[];
  suitableDogSizes?: string[];
  minAge?: number;
  breedRecommendations?: string[];
  notRecommendedFor?: string[];
  
  // Event duration in minutes
  duration?: number;
};

export type DogEvent = {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  avatar: string;
  imageUrl?: string; // Alias for backward compatibility
  category: EventCategory;
  date: string;
  time: string;
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  host: EventAttendee;
  attendees: EventAttendee[];
  maxAttendees: number;
  distance: number;
  difficultyLevel: DifficultyLevel;
  tags: string[];
  status: EventStatus;
  gallery: string[];
  comments: EventComment[];
  createdAt: string;
  updatedAt: string;
};

// Auth Types
export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  imageUrl?: string; // Alias for backward compatibility
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  preferences?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    eventReminders: boolean;
    newsletterSubscription: boolean;
  };
  createdAt: string;
  updatedAt?: string;
};

export type SignUpFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
};

export type SignInFormData = {
  email: string;
  password: string;
};

export type UserProfileFormData = {
  name: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  imageUrl?: string; // Alias for backward compatibility
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
};

// Plugin System Types
export interface Plugin {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
}

export interface ConfigPlugin extends Plugin {
  type: 'config';
  config: Record<string, any>;
}

export interface FunctionPlugin extends Plugin {
  type: 'function';
  execute: (...args: any[]) => any;
}

export interface UIPlugin extends Plugin {
  type: 'ui';
  component: () => ReactNode;
  mountPoint: string;
}

export type AnyPlugin = ConfigPlugin | FunctionPlugin | UIPlugin;

export interface PluginRegistry {
  configs: Map<string, ConfigPlugin>;
  functions: Map<string, FunctionPlugin>;
  ui: Map<string, UIPlugin>;
}

export interface PluginManagerConfig {
  enableHotReload?: boolean;
  validatePlugins?: boolean;
  onError?: (error: Error) => void;
}

// Playdate Match Type
export type PlaydateMatch = {
  dogId: string;
  dogName: string;
  dogAvatar: string;
  ownerName: string;
  ownerAvatar: string;
  compatibilityScore: number; // 0-100%
  compatibilityFactors: {
    factor: string;
    score: number;
    description: string;
  }[];
  matchReason: string;
  lastSeen?: string;
  mutualFriends?: number;
};

export type EnergyLevel = 'low' | 'moderate' | 'high' | 'any';
export type TrainingLevel = 'beginner' | 'intermediate' | 'advanced' | 'any';

export interface EventRequirements {
  minAge?: number;
  maxAge?: number;
  dogSize?: DogSize | DogSize[];
  energyLevel?: EnergyLevel | EnergyLevel[];
  trainingLevel?: TrainingLevel | TrainingLevel[];
  breeds?: string[];
}

export interface ScoredEvent {
  event: Event;
  score: number;
  matchReasons: string[];
}