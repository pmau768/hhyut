// Event-related types for domain-driven approach

// Basic category types
export type EventCategory = 
  | 'Walk' 
  | 'Run' 
  | 'Training' 
  | 'Social' 
  | 'Playdate' 
  | 'Other';

export type EventStatus = 'Open' | 'Full' | 'Cancelled' | 'Completed';

// Attendee representation
export type EventAttendee = {
  id: string;
  name: string;
  avatar: string;
  dogName?: string;
  joinedAt?: string;
};

// Event host information
export type EventHost = {
  id: string;
  name: string;
  avatar: string;
};

// Comment on an event
export type EventComment = {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes?: number;
  replies?: EventComment[];
};

// Location information for events
export type EventLocation = {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

// Dog-related fields for event requirements
export type DogSize = 'Small' | 'Medium' | 'Large' | 'Any';
export type DogEnergyLevel = 'Low' | 'Medium' | 'High';
export type DifficultyLevel = 'Easy' | 'Moderate' | 'Challenging';
export type DogAbility = 
  | 'Running' 
  | 'Sprinting' 
  | 'Climbing' 
  | 'Swimming' 
  | 'Jumping' 
  | 'OffLeash' 
  | 'Socialization' 
  | 'BasicCommands' 
  | 'AdvancedCommands';

// Main event type
export type Event = {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  avatar: string;
  date: string;
  time: string;
  location: EventLocation;
  category: EventCategory;
  tags: string[];
  maxAttendees: number;
  attendees: EventAttendee[];
  host: EventHost;
  status: EventStatus;
  gallery?: string[];
  comments?: EventComment[];
  createdAt: string;
  updatedAt: string;
  
  // Dog-specific requirements
  difficultyLevel: DifficultyLevel;
  requiredAbilities?: DogAbility[];
  suitableEnergyLevels?: DogEnergyLevel[];
  suitableDogSizes?: DogSize[];
  minAge?: number;
  duration?: number; // in minutes
  breedRecommendations?: string[];
  notRecommendedFor?: string[];
};

// Type for creating a new event
export type EventFormData = Omit<Event, 'id' | 'attendees' | 'status' | 'createdAt' | 'updatedAt' | 'gallery' | 'comments'>;

// Type for event filters
export type EventFilters = {
  category?: EventCategory;
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in miles
  };
  date?: Date;
  searchQuery?: string;
  dogCompatible?: {
    size?: DogSize[];
    energyLevel?: DogEnergyLevel[];
    minAge?: number;
  };
};

// Dog and event compatibility score
export type EventCompatibilityScore = {
  event: Event;
  score: number; // 0-100
  matchReasons: string[];
}; 