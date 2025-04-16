import { Event, EventAttendee, EventCategory, EventFormData, EventStatus } from '../types';

// Storage key for events
const STORAGE_KEY = 'events';

// Get all events from storage
export const getAllEvents = (): Event[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const eventsJson = localStorage.getItem(STORAGE_KEY);
    return eventsJson ? JSON.parse(eventsJson) : [];
  } catch (error) {
    console.error('Error getting events from storage:', error);
    return [];
  }
};

// Save all events to storage
export const saveEvents = (events: Event[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events to storage:', error);
  }
};

// Get event by ID
export const getEventById = (id: string): Event | undefined => {
  const events = getAllEvents();
  return events.find(event => event.id === id);
};

// Create a new event
export const createEvent = (eventData: EventFormData): Event => {
  const events = getAllEvents();
  const newEvent: Event = {
    ...eventData,
    id: `event-${crypto.randomUUID()}`,
    attendees: [],
    status: 'Open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: []
  };
  
  const updatedEvents = [...events, newEvent];
  saveEvents(updatedEvents);
  
  return newEvent;
};

// Update an existing event
export const updateEvent = (id: string, eventData: Partial<Event>): Event | undefined => {
  const events = getAllEvents();
  const eventIndex = events.findIndex(event => event.id === id);
  
  if (eventIndex === -1) return undefined;
  
  const updatedEvent = {
    ...events[eventIndex],
    ...eventData,
    updatedAt: new Date().toISOString()
  };
  
  const updatedEvents = [
    ...events.slice(0, eventIndex),
    updatedEvent,
    ...events.slice(eventIndex + 1)
  ];
  
  saveEvents(updatedEvents);
  return updatedEvent;
};

// Delete an event
export const deleteEvent = (id: string): boolean => {
  const events = getAllEvents();
  const filteredEvents = events.filter(event => event.id !== id);
  
  if (filteredEvents.length === events.length) {
    return false; // No event was deleted
  }
  
  saveEvents(filteredEvents);
  return true;
};

// Join an event
export const joinEvent = (eventId: string, attendee: EventAttendee): Event | undefined => {
  const event = getEventById(eventId);
  if (!event) return undefined;
  
  // Check if user is already attending
  const isAlreadyAttending = event.attendees.some(a => a.id === attendee.id);
  if (isAlreadyAttending) return event;
  
  // Check if event is full
  if (event.attendees.length >= event.maxAttendees) {
    return undefined;
  }
  
  const updatedEvent = {
    ...event,
    attendees: [...event.attendees, { ...attendee, joinedAt: new Date().toISOString() }],
    status: event.attendees.length + 1 >= event.maxAttendees ? 'Full' as EventStatus : 'Open' as EventStatus,
    updatedAt: new Date().toISOString()
  };
  
  return updateEvent(eventId, updatedEvent);
};

// Leave an event
export const leaveEvent = (eventId: string, attendeeId: string): Event | undefined => {
  const event = getEventById(eventId);
  if (!event) return undefined;
  
  const updatedEvent = {
    ...event,
    attendees: event.attendees.filter(a => a.id !== attendeeId),
    status: 'Open' as EventStatus, // If someone leaves, it's definitely not full anymore
    updatedAt: new Date().toISOString()
  };
  
  return updateEvent(eventId, updatedEvent);
};

// Add a comment to an event
export const addComment = (eventId: string, comment: Omit<EventAttendee, 'id'>): Event | undefined => {
  const event = getEventById(eventId);
  if (!event) return undefined;
  
  const newComment = {
    id: `comment-${crypto.randomUUID()}`,
    ...comment,
    createdAt: new Date().toISOString()
  };
  
  const updatedEvent = {
    ...event,
    comments: [newComment, ...(event.comments || [])],
    updatedAt: new Date().toISOString()
  };
  
  return updateEvent(eventId, updatedEvent);
};

// Get events by category
export const getEventsByCategory = (category: EventCategory): Event[] => {
  const events = getAllEvents();
  return events.filter(event => event.category === category);
};

// Search for events by query string
export const searchEvents = (query: string): Event[] => {
  if (!query.trim()) return getAllEvents();
  
  const events = getAllEvents();
  const lowercaseQuery = query.toLowerCase().trim();
  
  return events.filter(event => 
    event.title.toLowerCase().includes(lowercaseQuery) ||
    event.description.toLowerCase().includes(lowercaseQuery) ||
    event.shortDescription.toLowerCase().includes(lowercaseQuery) ||
    event.location.name.toLowerCase().includes(lowercaseQuery) ||
    event.location.address.toLowerCase().includes(lowercaseQuery) ||
    event.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// Filter events by dates in the future
export const getUpcomingEvents = (): Event[] => {
  const events = getAllEvents();
  const now = new Date();
  
  return events.filter(event => {
    const eventDate = new Date(`${event.date} ${event.time}`);
    return eventDate > now;
  }).sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });
};

// Initialize with mock data if no events exist
export const initializeEventStorage = (mockEvents: Event[]): void => {
  const existingEvents = getAllEvents();
  
  if (existingEvents.length === 0) {
    saveEvents(mockEvents);
  }
}; 