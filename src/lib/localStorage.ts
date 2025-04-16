import { DogProfile, Event, EventAttendee, EventHost, DogActivity, User } from '@/lib/types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/lib/services/storage';

// Storage keys
const STORAGE_KEYS_LEGACY = {
  DOGS: 'woofer_dogs',
  EVENTS: 'woofer_events',
  USER: 'woofer_user',
  DOG_PARKS: 'woofer_dog_parks',
  MEETUPS: 'woofer_meetups',
  TRAINING_CLASSES: 'woofer_training_classes',
};

// Default mock data
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

const DEFAULT_EVENTS: Event[] = [
  {
    id: "event1",
    title: "Morning Trail Run",
    description: "Join us for an energetic trail run with dogs! Suitable for active, athletic dogs that can keep up a good pace for 5km.",
    shortDescription: "5km trail run for athletic dogs",
    location: {
      name: "Forest Park Trails",
      address: "123 Forest Lane, Portland, OR",
      coordinates: {
        lat: 45.5755,
        lng: -122.7465
      }
    },
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    time: "7:30 AM",
    category: "Run",
    host: {
      id: "user2",
      name: "Mike Johnson",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
    },
    requirements: {
      minAge: 1,
      energyLevel: "high",
      trainingLevel: "intermediate"
    },
    attendeeCount: 8,
    tags: ["running", "athletic", "high-energy"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1593091861575-84e13d16a2d4?auto=format&fit=crop&q=80&w=400",
    maxAttendees: 15,
    attendees: [
      {
        id: "user2",
        name: "Mike Johnson",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
        dogName: "Rocky",
        joinedAt: new Date().toISOString()
      }
    ],
    status: "Open",
    difficultyLevel: "Moderate",
    requiredAbilities: ["Running", "OffLeash"],
    suitableEnergyLevels: ["high"],
    duration: 60
  },
  {
    id: "event2",
    title: "Puppy Socialization Hour",
    description: "Safe and supervised playtime for puppies under 1 year old. Great opportunity to work on socialization skills and puppy manners.",
    shortDescription: "Supervised play for puppies under 1 year",
    location: {
      name: "Paws & Play Dog Center",
      address: "456 Main Street, Portland, OR",
      coordinates: {
        lat: 45.5231,
        lng: -122.6765
      }
    },
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    time: "11:00 AM",
    category: "Social",
    host: {
      id: "user3",
      name: "Sarah Wilson",
      profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
    },
    requirements: {
      maxAge: 1,
      dogSize: ["small", "medium"]
    },
    attendeeCount: 5,
    tags: ["puppies", "socialization", "training"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1601758123927-4f7acc7da589?auto=format&fit=crop&q=80&w=400",
    maxAttendees: 10,
    attendees: [
      {
        id: "user3",
        name: "Sarah Wilson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
        dogName: "Luna",
        joinedAt: new Date().toISOString()
      }
    ],
    status: "Open",
    difficultyLevel: "Easy",
    requiredAbilities: ["Socialization", "BasicCommands"],
    suitableEnergyLevels: ["low", "moderate", "high"],
    duration: 45
  },
  {
    id: "event3",
    title: "Advanced Obedience Workshop",
    description: "Workshop focusing on advanced obedience skills, distraction training, and reliable recall. For dogs with solid basic obedience foundations.",
    shortDescription: "Advanced training for well-trained dogs",
    location: {
      name: "Canine Excellence Training Center",
      address: "789 Training Blvd, Portland, OR",
      coordinates: {
        lat: 45.5342,
        lng: -122.6587
      }
    },
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    time: "4:00 PM",
    category: "Training",
    host: {
      id: "user4",
      name: "David Chen",
      profileImage: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200"
    },
    requirements: {
      minAge: 1,
      trainingLevel: "intermediate"
    },
    attendeeCount: 6,
    tags: ["training", "obedience", "advanced"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1542944201-729d634e57a6?auto=format&fit=crop&q=80&w=400",
    maxAttendees: 8,
    attendees: [
      {
        id: "user4",
        name: "David Chen",
        avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200",
        dogName: "Cooper",
        joinedAt: new Date().toISOString()
      }
    ],
    status: "Open",
    difficultyLevel: "Challenging",
    requiredAbilities: ["BasicCommands", "AdvancedCommands"],
    suitableEnergyLevels: ["moderate", "high"],
    duration: 90
  }
];

const DEFAULT_DOG_PARKS = [
  {
    id: "park1",
    name: "Central Park Dog Run",
    address: "Central Park, New York, NY",
    coordinates: { lat: 40.7812, lng: -73.9665 },
    description: "Large off-leash area with separate sections for small and large dogs.",
    amenities: ["Water stations", "Seating", "Shade", "Waste stations"],
    rating: 4.5,
    reviewCount: 128,
    images: ["https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=800"],
    distance: 0.8, // miles
    isOffLeash: true,
    features: ["Fenced", "Water access", "Small dog area"],
    popularTimes: {
      weekdays: ["7-9am", "5-7pm"],
      weekends: ["9-11am", "3-5pm"]
    }
  },
  {
    id: "park2",
    name: "Riverside Dog Park",
    address: "Riverside Park, New York, NY",
    coordinates: { lat: 40.8025, lng: -73.9718 },
    description: "Scenic dog run with river views and plenty of space to play.",
    amenities: ["Water stations", "Benches", "Waste stations"],
    rating: 4.2,
    reviewCount: 96,
    images: ["https://images.unsplash.com/photo-1586821678643-9b15bfec9b14?auto=format&fit=crop&q=80&w=800"],
    distance: 1.2, // miles
    isOffLeash: true,
    features: ["Fenced", "Views"],
    popularTimes: {
      weekdays: ["6-8am", "6-8pm"],
      weekends: ["10am-1pm", "4-6pm"]
    }
  },
  {
    id: "park3",
    name: "Hudson River Dog Park",
    address: "Hudson River Park, New York, NY",
    coordinates: { lat: 40.7484, lng: -74.0084 },
    description: "Waterfront dog park with spectacular views and large play area.",
    amenities: ["Water stations", "Shade structures", "Waste stations", "Seating"],
    rating: 4.7,
    reviewCount: 152,
    images: ["https://images.unsplash.com/photo-1594003530908-5d100b23b2ed?auto=format&fit=crop&q=80&w=800"],
    distance: 1.5, // miles
    isOffLeash: true,
    features: ["Fenced", "Water access", "Double gates"],
    popularTimes: {
      weekdays: ["7-9am", "5-7pm"],
      weekends: ["8-11am", "3-6pm"]
    }
  }
];

const DEFAULT_MEETUPS = [
  {
    id: "meetup1",
    title: "Morning Play Session",
    description: "Join us for a fun morning play session with our dogs! All friendly dogs welcome.",
    parkId: "park1",
    parkName: "Central Park Dog Run",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    time: "9:00 AM",
    duration: 60, // minutes
    host: {
      id: "user1",
      name: "Emma Wilson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
    },
    attendees: [
      {
        userId: "user1",
        userName: "Emma Wilson",
        userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
        dogName: "Max",
        dogAvatar: "https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?auto=format&fit=crop&q=80&w=200",
      }
    ],
    maxAttendees: 10,
    dogSizePreference: "Any",
    isRecurring: false,
    tags: ["morning", "social", "play"]
  },
  {
    id: "meetup2",
    title: "Weekend Small Dogs Gathering",
    description: "A meetup specifically for small dogs under 20 pounds. Great opportunity for socialization in a safe environment.",
    parkId: "park2",
    parkName: "Riverside Dog Park",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    time: "10:30 AM",
    duration: 90, // minutes
    host: {
      id: "user2",
      name: "John Davis",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
    },
    attendees: [
      {
        userId: "user2",
        userName: "John Davis",
        userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
        dogName: "Bella",
        dogAvatar: "https://images.unsplash.com/photo-1605897472359-3d5ab59efa41?auto=format&fit=crop&q=80&w=200",
      },
      {
        userId: "user3",
        userName: "Sarah Miller",
        userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
        dogName: "Daisy",
        dogAvatar: "https://images.unsplash.com/photo-1583511655826-05700a463f78?auto=format&fit=crop&q=80&w=200",
      }
    ],
    maxAttendees: 8,
    dogSizePreference: "Small",
    isRecurring: true,
    recurringPattern: "Weekly",
    tags: ["small-dogs", "weekend", "social"]
  },
  {
    id: "meetup3",
    title: "Evening Exercise Group",
    description: "After-work dog exercise group. We do a combination of play and structured walking.",
    parkId: "park3",
    parkName: "Hudson River Dog Park",
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    time: "6:00 PM",
    duration: 60, // minutes
    host: {
      id: "user4",
      name: "Michael Johnson",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200"
    },
    attendees: [
      {
        userId: "user4",
        userName: "Michael Johnson",
        userAvatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200",
        dogName: "Rocky",
        dogAvatar: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=200",
      }
    ],
    maxAttendees: 12,
    dogSizePreference: "Any",
    isRecurring: true,
    recurringPattern: "Weekdays",
    tags: ["evening", "exercise", "weekday"]
  }
];

const DEFAULT_USER: User = {
  id: "user1",
  email: "johndoe@example.com",
  name: "John Doe",
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

// Use the storage service instead of direct localStorage access
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  return getStorageItem(key, defaultValue);
};

const setToStorage = <T>(key: string, value: T): void => {
  setStorageItem(key, value);
};

// Dog operations
export const getDogs = (): DogProfile[] => {
  return getFromStorage<DogProfile[]>(STORAGE_KEYS.DOGS, DEFAULT_DOGS);
};

export const setDogs = (dogs: DogProfile[]): void => {
  setToStorage(STORAGE_KEYS.DOGS, dogs);
};

export const getDogById = (id: string): DogProfile | undefined => {
  const dogs = getDogs();
  return dogs.find(dog => dog.id === id);
};

export const addDog = (dog: DogProfile): DogProfile => {
  // Ensure the dog has the required properties
  const newDog: DogProfile = {
    ...dog,
    id: dog.id || `dog${Date.now()}`,
    createdAt: dog.createdAt || new Date().toISOString(),
    updatedAt: dog.updatedAt || new Date().toISOString(),
    joinedEvents: dog.joinedEvents || [],
    activities: dog.activities || []
  };
  
  const dogs = getDogs();
  setDogs([...dogs, newDog]);
  return newDog;
};

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

export const deleteDog = (id: string): boolean => {
  const dogs = getDogs();
  const filteredDogs = dogs.filter(dog => dog.id !== id);
  
  if (filteredDogs.length === dogs.length) return false;
  
  setDogs(filteredDogs);
  return true;
};

// Event operations
export const getEvents = (): Event[] => {
  return getFromStorage<Event[]>(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS);
};

export const setEvents = (events: Event[]): void => {
  setToStorage(STORAGE_KEYS.EVENTS, events);
};

export const getEventById = (id: string): Event | undefined => {
  const events = getEvents();
  return events.find(event => event.id === id);
};

export const addEvent = (event: Event): Event => {
  // Ensure the event has the required properties
  const newEvent: Event = {
    ...event,
    id: event.id || `event${Date.now()}`,
    createdAt: event.createdAt || new Date().toISOString(),
    updatedAt: event.updatedAt || new Date().toISOString(),
    attendees: event.attendees || [],
    status: event.status || 'Open'
  };
  
  const events = getEvents();
  setEvents([...events, newEvent]);
  return newEvent;
};

export const updateEvent = (id: string, updates: Partial<Event>): Event | undefined => {
  const events = getEvents();
  const index = events.findIndex(event => event.id === id);
  
  if (index === -1) return undefined;
  
  const updatedEvent = {
    ...events[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  events[index] = updatedEvent;
  setEvents(events);
  return updatedEvent;
};

export const deleteEvent = (id: string): boolean => {
  const events = getEvents();
  const filteredEvents = events.filter(event => event.id !== id);
  
  if (filteredEvents.length === events.length) return false;
  
  setEvents(filteredEvents);
  return true;
};

// Meetup operations
export const getMeetups = () => {
  return getFromStorage(STORAGE_KEYS.MEETUPS, DEFAULT_MEETUPS);
};

export const setMeetups = (meetups: any[]) => {
  setToStorage(STORAGE_KEYS.MEETUPS, meetups);
};

export const addMeetup = (meetup: any) => {
  const meetups = getMeetups();
  const newMeetup = {
    ...meetup,
    id: meetup.id || `meetup${Date.now()}`,
    createdAt: meetup.createdAt || new Date().toISOString(),
    updatedAt: meetup.updatedAt || new Date().toISOString()
  };
  
  setMeetups([...meetups, newMeetup]);
  return newMeetup;
};

// Join/leave meetup operations
export const joinMeetup = (meetupId: string, dogId: string) => {
  const meetups = getMeetups();
  const meetupIndex = meetups.findIndex(m => m.id === meetupId);
  
  if (meetupIndex === -1) return false;

  const dogs = getDogs();
  const dog = dogs.find(d => d.id === dogId);
  
  if (!dog) return false;
  
  // Check if dog is already attending
  const isAttending = meetups[meetupIndex].attendees.some(
    (a: EventAttendee) => a.dogName === dog.name
  );
  
  if (isAttending) return true;
  
  // Add dog to meetup attendees
  const attendee: EventAttendee = {
    id: dog.owner,
    name: 'Current User', // In a real app, this would be the user's name
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=200',
    dogName: dog.name,
    joinedAt: new Date().toISOString()
  };
  
  const updatedMeetup = {
    ...meetups[meetupIndex],
    attendees: [...meetups[meetupIndex].attendees, attendee],
    attendeeCount: meetups[meetupIndex].attendeeCount + 1,
    updatedAt: new Date().toISOString()
  };
  
  meetups[meetupIndex] = updatedMeetup;
  setMeetups(meetups);
  
  // Add meetup to dog's joined meetups
  const updatedDog = {
    ...dog,
    joinedEvents: [...(dog.joinedEvents || []), meetupId],
    updatedAt: new Date().toISOString()
  };
  
  updateDog(dogId, updatedDog);
  return true;
};

// Dog park operations
export const getDogParks = () => {
  return getFromStorage(STORAGE_KEYS.DOG_PARKS, DEFAULT_DOG_PARKS);
};

export const setDogParks = (parks: any[]) => {
  setToStorage(STORAGE_KEYS.DOG_PARKS, parks);
};

// User operations
export const getUser = (): User => {
  return getFromStorage<User>(STORAGE_KEYS.USER, DEFAULT_USER);
};

export const setUser = (user: User): void => {
  setToStorage(STORAGE_KEYS.USER, user);
};

export const updateUser = (updates: Partial<User>): User => {
  const user = getUser();
  const updatedUser = {
    ...user,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  setUser(updatedUser);
  return updatedUser;
};

// Initialize localStorage on app load
export const initializeLocalStorage = (): void => {
  console.log('Initializing localStorage with default data...');
  
  // Initialize Dogs
  if (!localStorage.getItem(STORAGE_KEYS.DOGS)) {
    setDogs(DEFAULT_DOGS);
  }
  
  // Initialize Events
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    setEvents(DEFAULT_EVENTS);
  }
  
  // Initialize User
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    setUser(DEFAULT_USER);
  }
  
  // Initialize Dog Parks
  if (!localStorage.getItem(STORAGE_KEYS.DOG_PARKS)) {
    setDogParks(DEFAULT_DOG_PARKS);
  }
  
  // Initialize Meetups
  if (!localStorage.getItem(STORAGE_KEYS.MEETUPS)) {
    setMeetups(DEFAULT_MEETUPS);
  }
  
  console.log('localStorage initialization complete!');
};

// Join/leave event operations
export const joinEvent = (eventId: string, dogId: string): boolean => {
  const events = getEvents();
  const eventIndex = events.findIndex(e => e.id === eventId);
  
  if (eventIndex === -1) return false;

  const dogs = getDogs();
  const dogIndex = dogs.findIndex(d => d.id === dogId);
  
  if (dogIndex === -1) return false;
  
  const dog = dogs[dogIndex];
  
  // Check if dog is already attending
  const isAttending = events[eventIndex].attendees?.some(
    (a: EventAttendee) => a.dogName === dog.name
  );
  
  if (isAttending) return true;
  
  // Add dog to event attendees
  const attendee: EventAttendee = {
    id: dog.owner,
    name: 'Current User', // In a real app, this would be the user's name
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=200',
    dogName: dog.name,
    joinedAt: new Date().toISOString()
  };
  
  // Ensure attendees array exists
  if (!events[eventIndex].attendees) {
    events[eventIndex].attendees = [];
  }
  
  // Update the event with the new attendee
  const updatedEvent = {
    ...events[eventIndex],
    attendees: [...events[eventIndex].attendees!, attendee],
    attendeeCount: (events[eventIndex].attendeeCount || 0) + 1,
    updatedAt: new Date().toISOString()
  };
  
  events[eventIndex] = updatedEvent;
  setEvents(events);
  
  // Add event to dog's joined events
  if (!dog.joinedEvents) {
    dog.joinedEvents = [];
  }
  
  dog.joinedEvents.push(eventId);
  dog.updatedAt = new Date().toISOString();
  
  dogs[dogIndex] = dog;
  setDogs(dogs);
  
  return true;
}; 