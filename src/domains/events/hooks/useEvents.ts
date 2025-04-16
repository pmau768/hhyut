import { useState, useEffect, useMemo, useCallback } from 'react';
import { Event, EventAttendee, EventCategory, EventFilters, EventFormData } from '../types';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
  addComment,
  getEventsByCategory,
  searchEvents,
  getUpcomingEvents,
  initializeEventStorage
} from '../services/eventStorage';

// Mock events for initialization
import { mockEvents } from './mockData';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filters, setFilters] = useState<EventFilters>({});

  // Initialize and load events
  useEffect(() => {
    try {
      setLoading(true);
      // Initialize with mock data if needed
      initializeEventStorage(mockEvents);
      // Get all events
      const allEvents = getAllEvents();
      setEvents(allEvents);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load events'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Get filtered events based on current filters
  const filteredEvents = useMemo(() => {
    let result = [...events];
    
    // Filter by category
    if (filters.category) {
      result = result.filter(event => event.category === filters.category);
    }
    
    // Filter by search query
    if (filters.searchQuery) {
      result = result.filter(event => 
        event.title.toLowerCase().includes(filters.searchQuery!.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.searchQuery!.toLowerCase()) ||
        event.location.name.toLowerCase().includes(filters.searchQuery!.toLowerCase())
      );
    }
    
    // Filter by location if available
    if (filters.location) {
      const { latitude, longitude, radius } = filters.location;
      
      result = result.filter(event => {
        // Skip events without coordinates
        if (!event.location.coordinates) return false;
        
        // Calculate distance using Haversine formula
        const lat1 = latitude;
        const lon1 = longitude;
        const lat2 = event.location.coordinates.lat;
        const lon2 = event.location.coordinates.lng;
        
        const R = 3958.8; // Earth's radius in miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        return distance <= radius;
      });
    }
    
    // Add more filters as needed (dog compatibility, etc.)
    
    return result;
  }, [events, filters]);

  // Create a new event
  const handleCreateEvent = useCallback(async (eventData: EventFormData): Promise<Event> => {
    try {
      const newEvent = createEvent(eventData);
      setEvents(prevEvents => [...prevEvents, newEvent]);
      return newEvent;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create event');
      setError(error);
      throw error;
    }
  }, []);

  // Update an existing event
  const handleUpdateEvent = useCallback(async (id: string, eventData: Partial<Event>): Promise<Event | undefined> => {
    try {
      const updatedEvent = updateEvent(id, eventData);
      if (updatedEvent) {
        setEvents(prevEvents => 
          prevEvents.map(event => event.id === id ? updatedEvent : event)
        );
        
        // Update selected event if it's the one being updated
        if (selectedEvent?.id === id) {
          setSelectedEvent(updatedEvent);
        }
      }
      return updatedEvent;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update event');
      setError(error);
      throw error;
    }
  }, [selectedEvent]);

  // Delete an event
  const handleDeleteEvent = useCallback(async (id: string): Promise<boolean> => {
    try {
      const success = deleteEvent(id);
      if (success) {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
        
        // Clear selected event if it's the one being deleted
        if (selectedEvent?.id === id) {
          setSelectedEvent(null);
        }
      }
      return success;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete event');
      setError(error);
      throw error;
    }
  }, [selectedEvent]);

  // Join an event
  const handleJoinEvent = useCallback(async (eventId: string, attendee: EventAttendee): Promise<Event | undefined> => {
    try {
      const updatedEvent = joinEvent(eventId, attendee);
      if (updatedEvent) {
        setEvents(prevEvents => 
          prevEvents.map(event => event.id === eventId ? updatedEvent : event)
        );
        
        // Update selected event if it's the one being joined
        if (selectedEvent?.id === eventId) {
          setSelectedEvent(updatedEvent);
        }
      }
      return updatedEvent;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to join event');
      setError(error);
      throw error;
    }
  }, [selectedEvent]);

  // Leave an event
  const handleLeaveEvent = useCallback(async (eventId: string, attendeeId: string): Promise<Event | undefined> => {
    try {
      const updatedEvent = leaveEvent(eventId, attendeeId);
      if (updatedEvent) {
        setEvents(prevEvents => 
          prevEvents.map(event => event.id === eventId ? updatedEvent : event)
        );
        
        // Update selected event if it's the one being left
        if (selectedEvent?.id === eventId) {
          setSelectedEvent(updatedEvent);
        }
      }
      return updatedEvent;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to leave event');
      setError(error);
      throw error;
    }
  }, [selectedEvent]);

  // Get an event by ID
  const getEvent = useCallback((id: string): Event | undefined => {
    return getEventById(id);
  }, []);

  // Set the selected event
  const selectEvent = useCallback((id: string | null) => {
    if (id === null) {
      setSelectedEvent(null);
      return;
    }
    
    const event = getEventById(id);
    setSelectedEvent(event || null);
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<EventFilters>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    // State
    events,
    filteredEvents,
    loading,
    error,
    selectedEvent,
    filters,
    
    // Event CRUD operations
    createEvent: handleCreateEvent,
    updateEvent: handleUpdateEvent,
    deleteEvent: handleDeleteEvent,
    joinEvent: handleJoinEvent,
    leaveEvent: handleLeaveEvent,
    getEvent,
    
    // Selection and filtering
    selectEvent,
    updateFilters,
    resetFilters
  };
};

// Export mock data for testing and initialization
export { mockEvents } from './mockData'; 