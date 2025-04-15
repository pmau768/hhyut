/**
 * Centralized mock data for the application
 * This ensures consistency across components that need to use the same data
 */

import { DogProfile, Event, EventAttendee, EventComment, User, DogActivity, StreakData } from './types';

// ==================== USERS ===================
export const mockUsers: User[] = [
  {
    id: "currentUser",
    name: "Current User",
    email: "user@example.com",
    avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
    createdAt: new Date().toISOString(),
  }
];

// ==================== ATTENDEES ===================
export const mockAttendees: EventAttendee[] = [
  { 
    id: "1", 
    name: "Alice Smith", 
    avatar: "https://randomuser.me/api/portraits/women/1.jpg", 
    dogName: "Bella" 
  },
  { 
    id: "2", 
    name: "Bob Johnson", 
    avatar: "https://randomuser.me/api/portraits/men/1.jpg", 
    dogName: "Max" 
  },
  { 
    id: "3", 
    name: "Carol White", 
    avatar: "https://randomuser.me/api/portraits/women/2.jpg", 
    dogName: "Charlie" 
  },
  { 
    id: "4", 
    name: "David Brown", 
    avatar: "https://randomuser.me/api/portraits/men/2.jpg", 
    dogName: "Luna" 
  }
];

export const mockCurrentUserAttendee: EventAttendee = { 
  id: "currentUser", 
  name: "You", 
  avatar: "https://randomuser.me/api/portraits/lego/1.jpg", 
  dogName: "Oliver",
  joinedAt: "3 days ago"
};

// ==================== HOSTS ===================
export const mockHosts = {
  dog_lovers_club: {
    id: "h1",
    name: "Dog Lovers Club",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  pro_trainers: {
    id: "h2",
    name: "Pro Trainers",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg"
  },
  adventure_dogs: {
    id: "h3",
    name: "Adventure Dogs",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg"
  }
};

// ==================== COMMENTS ===================
export const mockComments: EventComment[] = [
  {
    id: "c1",
    userId: "u1",
    userName: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    content: "Looking forward to this! Will be my first time joining.",
    createdAt: "2 days ago"
  },
  {
    id: "c2",
    userId: "u2",
    userName: "Emma Smith",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    content: "The route is beautiful this time of year!",
    createdAt: "1 day ago"
  }
];

// ==================== DOG ACTIVITIES ===================
export const mockDogActivities: DogActivity[] = [
  {
    id: "a1",
    type: "Walk",
    date: "2024-04-10",
    duration: 45,
    distance: 3.2,
    notes: "Morning walk in the park"
  },
  {
    id: "a2",
    type: "Training",
    date: "2024-04-10",
    duration: 30,
    notes: "Recall training session"
  },
  {
    id: "a3",
    type: "Run",
    date: "2024-04-09",
    duration: 40,
    distance: 5.1,
    notes: "Evening run"
  }
];

// ==================== DOG PROFILES ===================
export const mockDogProfiles: DogProfile[] = [
  {
    id: "1",
    name: "Oliver",
    age: 4,
    breed: "Malinois",
    energy: "High",
    isGoodOffLeash: true,
    avatar: "https://images.unsplash.com/photo-1553882809-a4f57e59501d?auto=format&fit=crop&q=80&w=200&h=200",
    stats: {
      totalDistance: 127.5,
      totalActivities: 48,
      avgDuration: 45,
      streak: 7
    },
    activities: [...mockDogActivities],
    joinedEvents: ["1", "4"]
  },
  {
    id: "2",
    name: "Luna",
    age: 2,
    breed: "Border Collie",
    energy: "High",
    isGoodOffLeash: true,
    avatar: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&q=80&w=200&h=200",
    stats: {
      totalDistance: 85.2,
      totalActivities: 32,
      avgDuration: 40,
      streak: 4
    },
    activities: [],
    joinedEvents: ["2"]
  }
];

// Helper to generate dates for events
const today = new Date();
const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
const twoDays = new Date(today); twoDays.setDate(today.getDate() + 2);
const fiveDays = new Date(today); fiveDays.setDate(today.getDate() + 5);

// ==================== EVENTS ===================
export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Morning Group Run",
    description: "Join us for an energetic morning run with your four-legged friends! All fitness levels welcome. We'll meet at the Central Park entrance and do a scenic loop around the park. This is a great opportunity to exercise with your dog while meeting other pet parents. Remember to bring water for both you and your furry friend. We'll take breaks as needed and keep a moderate pace suitable for all participants.",
    shortDescription: "Group run for dogs and their humans. All fitness levels welcome!",
    avatar: "https://images.unsplash.com/photo-1558430665-6ddd08021c29?auto=format&fit=crop&q=80&w=3000",
    imageUrl: "https://images.unsplash.com/photo-1558430665-6ddd08021c29?auto=format&fit=crop&q=80&w=3000",
    date: "Apr 15, 2024",
    time: "7:00 AM",
    location: {
      name: "Central Park",
      address: "Central Park, New York, NY",
      coordinates: { lat: 40.7829, lng: -73.9654 }
    },
    category: "Run",
    tags: ["running", "fitness", "morning", "social", "all-levels"],
    maxAttendees: 15,
    attendees: [mockCurrentUserAttendee],
    host: mockHosts.dog_lovers_club,
    status: "Open",
    gallery: [
      "https://images.unsplash.com/photo-1558430665-6ddd08021c29?auto=format&fit=crop&q=80&w=3000",
      "https://images.unsplash.com/photo-1562176566-e9afd27531d4?auto=format&fit=crop&q=80&w=3000",
      "https://images.unsplash.com/photo-1558430557-1a420d84c16a?auto=format&fit=crop&q=80&w=3000"
    ],
    comments: mockComments,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    // Dog requirements
    difficultyLevel: "Moderate",
    requiredAbilities: ["Running", "OffLeash"],
    suitableEnergyLevels: ["Medium", "High"],
    suitableDogSizes: ["Medium", "Large"],
    minAge: 12, // 1 year minimum
    breedRecommendations: ["Border Collie", "Labrador", "Shepherd", "Husky"],
    notRecommendedFor: ["puppies", "senior dogs", "brachycephalic breeds"]
  },
  {
    id: "2",
    title: "Puppy Training Workshop",
    description: "Professional training session focusing on basic obedience and socialization. Perfect for puppies aged 3-6 months. Our certified trainer will cover essential commands, leash manners, and proper socialization techniques. Limited spots to ensure individual attention for each puppy. All participants will receive a training guide and certificate of completion.",
    shortDescription: "Learn essential training techniques for your puppy with our certified trainer.",
    avatar: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=3000",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=3000",
    date: tomorrow.toISOString().split('T')[0],
    time: "10:00 AM",
    location: {
      name: "Doggy Academy",
      address: "123 Pet Street, New York, NY",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    category: "Training",
    tags: ["training", "puppies", "beginner", "professional", "certification"],
    maxAttendees: 8,
    attendees: [{...mockCurrentUserAttendee, dogName: "Luna"}],
    host: mockHosts.pro_trainers,
    status: "Open",
    gallery: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=3000",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=3000",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=3000"
    ],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    // Dog requirements
    difficultyLevel: "Easy",
    requiredAbilities: ["BasicCommands"],
    suitableEnergyLevels: ["Low", "Medium", "High"],
    suitableDogSizes: ["Any"],
    minAge: 3, // 3 months minimum
    breedRecommendations: [],
    notRecommendedFor: []
  },
  {
    id: "3",
    title: "Advanced Agility Training",
    description: "Join us for an intensive agility training session designed for experienced dogs. This event features a challenging course with jumps, tunnels, weave poles, and more. Ideal for dogs who already have basic agility skills and are ready to take it to the next level. Handlers should have experience with agility commands and techniques.",
    shortDescription: "Advanced agility course for experienced dogs and handlers.",
    avatar: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?auto=format&fit=crop&q=80&w=3000",
    imageUrl: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?auto=format&fit=crop&q=80&w=3000",
    date: fiveDays.toISOString().split('T')[0],
    time: "2:00 PM",
    location: {
      name: "Agility Training Center",
      address: "456 Obstacle Avenue, New York, NY",
      coordinates: { lat: 40.7380, lng: -73.8750 }
    },
    category: "Training",
    tags: ["agility", "advanced", "competition", "obstacle-course"],
    maxAttendees: 12,
    attendees: [],
    host: mockHosts.pro_trainers,
    status: "Open",
    gallery: [
      "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?auto=format&fit=crop&q=80&w=3000"
    ],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    // Dog requirements
    difficultyLevel: "Challenging",
    requiredAbilities: ["Running", "Jumping", "OffLeash", "AdvancedCommands"],
    suitableEnergyLevels: ["High"],
    suitableDogSizes: ["Small", "Medium", "Large"],
    minAge: 18, // 1.5 years minimum
    breedRecommendations: ["Border Collie", "Australian Shepherd", "Sheltie", "Jack Russell"],
    notRecommendedFor: ["senior dogs", "dogs with joint issues", "brachycephalic breeds"]
  },
  {
    id: "4",
    title: "Evening Park Meetup",
    description: "Casual evening meetup at the local dog park.",
    shortDescription: "Evening meetup at the dog park",
    avatar: "https://images.unsplash.com/photo-1610041518889-c7c02c101d94?auto=format&fit=crop&q=80&w=3000",
    imageUrl: "https://images.unsplash.com/photo-1610041518889-c7c02c101d94?auto=format&fit=crop&q=80&w=3000",
    date: today.toISOString().split('T')[0],
    time: "6:00 PM",
    location: {
      name: "Riverside Dog Park",
      address: "Riverside Dr",
      coordinates: { lat: 40.82, lng: -73.95 }
    },
    category: "Social",
    tags: ["evening", "park", "social"],
    maxAttendees: 25,
    attendees: mockAttendees.slice(0, 4).concat([mockCurrentUserAttendee]),
    host: mockHosts.dog_lovers_club,
    status: "Open",
    gallery: [],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    difficultyLevel: "Easy",
    suitableEnergyLevels: ["Low", "Medium", "High"],
    suitableDogSizes: ["Any"]
  }
];

export const mockNearbyEvents: Event[] = [
  {
    id: "5",
    title: "Evening Training Session",
    shortDescription: "Training session for all skill levels",
    description: "Join us for an evening training session for dogs of all skill levels.",
    avatar: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=3000",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=3000",
    date: tomorrow.toISOString().split('T')[0],
    time: "7:00 PM",
    location: {
      name: "Central Park Training Area",
      address: "New York, NY",
      coordinates: { lat: 40.78, lng: -73.96 }
    },
    category: "Training",
    tags: ["training", "evening", "all-levels"],
    maxAttendees: 15,
    attendees: mockAttendees.slice(2, 3),
    host: mockHosts.pro_trainers,
    status: "Open",
    gallery: [],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    difficultyLevel: "Easy"
  },
  {
    id: "6",
    title: "Weekend Hiking Adventure",
    shortDescription: "Dog-friendly hiking trip through scenic trails",
    description: "Take your dogs on an exciting hiking adventure through scenic trails.",
    avatar: "https://images.unsplash.com/photo-1515756759274-5c5605364a37?auto=format&fit=crop&q=80&w=3000",
    imageUrl: "https://images.unsplash.com/photo-1515756759274-5c5605364a37?auto=format&fit=crop&q=80&w=3000",
    date: fiveDays.toISOString().split('T')[0],
    time: "9:00 AM",
    location: {
      name: "Bear Mountain",
      address: "Bear Mountain, NY",
      coordinates: { lat: 41.31, lng: -73.98 }
    },
    category: "Other",
    tags: ["hiking", "adventure", "weekend"],
    maxAttendees: 12,
    attendees: [],
    host: mockHosts.adventure_dogs,
    status: "Open",
    gallery: [],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    difficultyLevel: "Challenging"
  }
];

// ==================== STREAK DATA ===================
export const mockStreakData: StreakData = {
  currentStreak: 7,
  longestStreak: 14,
  lastActivityDate: new Date().toISOString(),
  streakHistory: [
    { date: '2024-04-01', completed: true },
    { date: '2024-04-02', completed: true },
    { date: '2024-04-03', completed: true },
    { date: '2024-04-04', completed: true },
    { date: '2024-04-05', completed: true },
    { date: '2024-04-06', completed: true },
    { date: '2024-04-07', completed: true }
  ]
};

// ==================== WEEKLY SUMMARY ===================
export const mockWeeklySummary = {
  totalWalks: 0,
  totalDistance: 0,
  totalMinutes: 0,
  walksCompletion: 0,
  distanceCompletion: 0,
  minutesCompletion: 0,
};

// ==================== WEEKLY GOALS ===================
export const mockWeeklyGoals = {
  walks: 10,
  distance: 20,
  minutes: 300,
}; 