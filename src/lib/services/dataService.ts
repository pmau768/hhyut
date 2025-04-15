import { 
  DogActivity, 
  DogEvent, 
  DogProfile, 
  EventComment, 
  EventAttendee, 
  EventHost,
  User,
  StreakData
} from '@/lib/types';
import { 
  mockUsers, 
  mockAttendees, 
  mockHosts, 
  mockComments, 
  mockDogActivities, 
  mockDogProfiles, 
  mockEvents,
  mockStreakData
} from '@/lib/mockData';

// In-memory storage for mock data
let users: User[] = [...mockUsers];
let attendees: EventAttendee[] = [...mockAttendees];
let hosts: EventHost[] = [...mockHosts];
let comments: EventComment[] = [...mockComments];
let dogActivities: DogActivity[] = [...mockDogActivities];
let dogProfiles: DogProfile[] = [...mockDogProfiles];
let events: DogEvent[] = [...mockEvents];
let streakData: StreakData = {...mockStreakData};

// User related functions
export const getUsers = () => users;
export const getUserById = (id: string) => users.find(u => u.id === id);
export const getCurrentUser = () => users[0]; // For demo purposes, first user is current

// Dog profile related functions
export const getDogProfiles = () => dogProfiles;
export const getDogProfilesByUserId = (userId: string) => dogProfiles.filter(dp => dp.ownerId === userId);
export const getDogProfileById = (id: string) => dogProfiles.find(dp => dp.id === id);
export const createDogProfile = (profile: Omit<DogProfile, 'id'>) => {
  const newProfile = { ...profile, id: `dog-${dogProfiles.length + 1}` };
  dogProfiles.push(newProfile);
  return newProfile;
};
export const updateDogProfile = (id: string, updates: Partial<DogProfile>) => {
  const index = dogProfiles.findIndex(dp => dp.id === id);
  if (index !== -1) {
    dogProfiles[index] = { ...dogProfiles[index], ...updates };
    return dogProfiles[index];
  }
  return null;
};

// Event related functions
export const getEvents = () => events;
export const getEventById = (id: string) => events.find(e => e.id === id);
export const getNearbyEvents = (limit = 3) => events.slice(0, limit);
export const getUpcomingEvents = (limit = 5) => {
  return events
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit);
};
export const createEvent = (event: Omit<DogEvent, 'id'>) => {
  const newEvent = { ...event, id: `event-${events.length + 1}` };
  events.push(newEvent);
  return newEvent;
};
export const updateEvent = (id: string, updates: Partial<DogEvent>) => {
  const index = events.findIndex(e => e.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...updates };
    return events[index];
  }
  return null;
};

// Attendee related functions
export const getAttendees = () => attendees;
export const getAttendeesByEventId = (eventId: string) => 
  attendees.filter(a => a.eventId === eventId);
export const addAttendee = (attendee: Omit<EventAttendee, 'id'>) => {
  const newAttendee = { ...attendee, id: `attendee-${attendees.length + 1}` };
  attendees.push(newAttendee);
  return newAttendee;
};

// Host related functions
export const getHosts = () => hosts;
export const getHostsByEventId = (eventId: string) => 
  hosts.filter(h => h.eventId === eventId);
export const getHostById = (id: string) => hosts.find(h => h.id === id);

// Comment related functions
export const getComments = () => comments;
export const getCommentsByEventId = (eventId: string) => 
  comments.filter(c => c.eventId === eventId);
export const addComment = (comment: Omit<EventComment, 'id' | 'timestamp'>) => {
  const newComment = { 
    ...comment, 
    id: `comment-${comments.length + 1}`,
    timestamp: new Date().toISOString()
  };
  comments.push(newComment);
  return newComment;
};

// Dog activity related functions
export const getDogActivities = () => dogActivities;
export const getDogActivitiesByDogId = (dogId: string) => 
  dogActivities.filter(da => da.dogId === dogId);
export const getRecentActivities = (limit = 7) => {
  return dogActivities
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};
export const addDogActivity = (activity: Omit<DogActivity, 'id'>) => {
  const newActivity = { ...activity, id: `activity-${dogActivities.length + 1}` };
  dogActivities.push(newActivity);
  return newActivity;
};

// Streak related functions
export const getStreakData = () => streakData;
export const updateStreakData = (updates: Partial<StreakData>) => {
  streakData = { ...streakData, ...updates };
  return streakData;
};

// Weather related functions (mock)
export const getWeatherForecast = (date: string, location: string) => {
  // Mock weather data based on date
  const day = new Date(date).getDay();
  const forecasts = [
    { condition: 'Sunny', temperature: 75, icon: '☀️' },
    { condition: 'Partly Cloudy', temperature: 68, icon: '⛅' },
    { condition: 'Cloudy', temperature: 62, icon: '☁️' },
    { condition: 'Rainy', temperature: 58, icon: '🌧️' },
    { condition: 'Stormy', temperature: 55, icon: '⛈️' },
    { condition: 'Snowy', temperature: 30, icon: '❄️' },
    { condition: 'Clear', temperature: 72, icon: '🌙' },
  ];
  
  return forecasts[day % forecasts.length];
}; 