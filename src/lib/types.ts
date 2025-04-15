import { ReactNode } from 'react';

export type DogProfile = {
  id: string;
  name: string;
  age: number;
  breed: string;
  energy: 'Low' | 'Medium' | 'High';
  isGoodOffLeash: boolean;
  imageUrl: string;
  stats: {
    totalDistance: number;
    totalActivities: number;
    avgDuration: number;
    streak: number;
  };
  activities: DogActivity[];
  joinedEvents: string[]; // References to event IDs
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

export type EventCategory = 'Walk' | 'Run' | 'Training' | 'Playdate' | 'Social' | 'Other';

export type EventStatus = 'Open' | 'Full' | 'Cancelled' | 'Completed';

export type EventHost = {
  id: string;
  name: string;
  imageUrl: string;
  bio?: string;
  rating?: number;
  eventsHosted?: number;
};

export type EventAttendee = {
  id: string;
  name: string;
  imageUrl: string;
  dogName: string;
  joinedAt?: string;
};

export type EventComment = {
  id: string;
  userId: string;
  userName: string;
  userImageUrl: string;
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
export type DogSize = 'Small' | 'Medium' | 'Large' | 'Any';

export type Event = {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  date: string;
  time: string;
  duration?: number; // in minutes
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  category: EventCategory;
  tags: string[];
  maxAttendees: number;
  attendees: EventAttendee[];
  host: EventHost;
  status: EventStatus;
  gallery: string[];
  comments: EventComment[];
  reactions?: EventReaction[];
  requirements?: string[];
  price?: number;
  recurring?: boolean;
  recurringPattern?: string;
  waitlist?: EventAttendee[];
  visibility?: 'public' | 'private' | 'invite-only';
  createdAt: string;
  updatedAt: string;
  
  // New dog requirement fields
  difficultyLevel?: DifficultyLevel;
  requiredAbilities?: DogAbility[];
  suitableEnergyLevels?: ('Low' | 'Medium' | 'High')[];
  suitableDogSizes?: DogSize[];
  minAge?: number;
  breedRecommendations?: string[];
  notRecommendedFor?: string[]; // List of conditions or breeds not recommended
};

// Auth Types
export type User = {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
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
  imageUrl?: string;
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