import { useState, useEffect } from "react";
import { Event, EventCategory, DogProfile, EventStatus } from "@/lib/types";
import { format } from "date-fns";
import EventCard from "@/components/events/EventCard";
import EventFilters from "@/components/events/EventFilters";
import EventDetailsView from "@/components/events/EventDetailsView";
import CreateEventPostDialog from "@/components/events/CreateEventPostDialog";
import NearbyEventsList from "@/components/events/NearbyEventsList";
import { DogRecommendedEvents } from "@/components/events/DogRecommendedEvents";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, Dog, MapPin, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Mock data - replace with actual data from your backend
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Morning Group Run",
    description: "Join us for an energetic morning run with your four-legged friends! All fitness levels welcome. We'll meet at the Central Park entrance and do a scenic loop around the park. This is a great opportunity to exercise with your dog while meeting other pet parents. Remember to bring water for both you and your furry friend. We'll take breaks as needed and keep a moderate pace suitable for all participants.",
    shortDescription: "Group run for dogs and their humans. All fitness levels welcome!",
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
    attendees: [
      {
        id: "currentUser", 
        name: "You",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
        dogName: "Oliver",
        joinedAt: "3 days ago"
      }
    ],
    host: {
      id: "host1",
      name: "Sarah Wilson",
      imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
    },
    status: "Open",
    gallery: [
      "https://images.unsplash.com/photo-1558430665-6ddd08021c29?auto=format&fit=crop&q=80&w=3000",
      "https://images.unsplash.com/photo-1562176566-e9afd27531d4?auto=format&fit=crop&q=80&w=3000",
      "https://images.unsplash.com/photo-1558430557-1a420d84c16a?auto=format&fit=crop&q=80&w=3000"
    ],
    comments: [
      {
        id: "c1",
        userId: "u1",
        userName: "John Doe",
        userImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
        content: "Looking forward to this! Will be my first time joining.",
        createdAt: "2 days ago"
      },
      {
        id: "c2",
        userId: "u2",
        userName: "Emma Smith",
        userImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
        content: "The route is beautiful this time of year!",
        createdAt: "1 day ago"
      }
    ],
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
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=3000",
    date: "Apr 16, 2024",
    time: "10:00 AM",
    location: {
      name: "Doggy Academy",
      address: "123 Pet Street, New York, NY",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    category: "Training",
    tags: ["training", "puppies", "beginner", "professional", "certification"],
    maxAttendees: 8,
    attendees: [
      {
        id: "currentUser", 
        name: "You",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
        dogName: "Luna",
        joinedAt: "1 day ago"
      }
    ],
    host: {
      id: "host2",
      name: "Mike Thompson",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
    },
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
    imageUrl: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?auto=format&fit=crop&q=80&w=3000",
    date: "Apr 20, 2024",
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
    host: {
      id: "host3",
      name: "Jessica Rodriguez",
      imageUrl: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=200"
    },
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
    title: "Small Dogs Social Hour",
    description: "A fun-filled playtime specially designed for small and toy breeds! This is a great opportunity for your small dog to socialize with other dogs their size in a safe, controlled environment. The play area is fully enclosed and monitored by professional trainers who ensure all dogs are playing nicely.",
    shortDescription: "Playtime and socialization for small and toy breed dogs.",
    imageUrl: "https://images.unsplash.com/photo-1583511655826-05700a463f78?auto=format&fit=crop&q=80&w=3000",
    date: "Apr 18, 2024",
    time: "5:00 PM",
    location: {
      name: "Little Paws Playground",
      address: "789 Small Street, New York, NY",
      coordinates: { lat: 40.7420, lng: -73.9890 }
    },
    category: "Playdate",
    tags: ["small-dogs", "socializing", "playtime", "toy-breeds"],
    maxAttendees: 15,
    attendees: [],
    host: {
      id: "host4",
      name: "David Chen",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
    },
    status: "Open",
    gallery: [
      "https://images.unsplash.com/photo-1583511655826-05700a463f78?auto=format&fit=crop&q=80&w=3000"
    ],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    // Dog requirements
    difficultyLevel: "Easy",
    requiredAbilities: ["Socialization"],
    suitableEnergyLevels: ["Low", "Medium", "High"],
    suitableDogSizes: ["Small"],
    minAge: 6, // 6 months minimum
    breedRecommendations: ["Chihuahua", "Yorkshire Terrier", "Pomeranian", "Maltese", "Toy Poodle"],
    notRecommendedFor: ["large dogs", "dog-aggressive dogs"]
  }
];

// Mock dogs data - replace with actual data from your backend
const mockDogs: DogProfile[] = [
  {
    id: "1",
    name: "Oliver",
    age: 4,
    breed: "Malinois",
    energy: "High",
    isGoodOffLeash: true,
    imageUrl: "https://images.unsplash.com/photo-1553882809-a4f57e59501d?auto=format&fit=crop&q=80&w=200&h=200",
    stats: {
      totalDistance: 127.5,
      totalActivities: 48,
      avgDuration: 45,
      streak: 7
    },
    activities: [],
    joinedEvents: []
  },
  {
    id: "2",
    name: "Luna",
    age: 2,
    breed: "Border Collie",
    energy: "High",
    isGoodOffLeash: true,
    imageUrl: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&q=80&w=200&h=200",
    stats: {
      totalDistance: 85.2,
      totalActivities: 32,
      avgDuration: 40,
      streak: 4
    },
    activities: [],
    joinedEvents: []
  }
];

const Events = () => {
  // Local Storage Integration
  const getLocalStorage = (key: string, fallback: Event[]) => {
    if (typeof window === 'undefined') return fallback;
    const stored = localStorage.getItem(key);
    try {
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };
  const setLocalStorage = (key: string, value: Event[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  };

  const [events, setEvents] = useState<Event[]>(() => getLocalStorage('events', mockEvents));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All'>('All');
  const [_, setSortBy] = useState("date-asc");
  const [__, setView] = useState<'grid' | 'list'>('grid');
  const [selectedDogForRecommendations, setSelectedDogForRecommendations] = useState<DogProfile | null>(
    mockDogs.length > 0 ? mockDogs[0] : null
  );
  
  // Location filtering state
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [searchRadius, setSearchRadius] = useState(10); // 10km default radius
  const [userLocation, setUserLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
    loading: boolean;
    error: string | null;
  }>({
    latitude: null,
    longitude: null,
    loading: false,
    error: null,
  });
  
  // Event joining state
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [selectedDog, setSelectedDog] = useState<string | null>(null);
  
  // Event details state
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  
  // Event creation loading state
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  // Save to localStorage whenever events changes
  useEffect(() => {
    setLocalStorage('events', events);
  }, [events]);

  const handleJoinEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setSelectedDog(null); // Reset selected dog
      setIsJoinDialogOpen(true);
    }
  };

  const handleConfirmJoin = () => {
    if (!selectedEvent || !selectedDog) return;

    const selectedDogProfile = mockDogs.find(d => d.id === selectedDog);
    if (!selectedDogProfile) return;

    // Update events with new attendee
    const updatedEvents = events.map(event => {
      if (event.id === selectedEvent.id) {
        const newAttendee = {
          id: selectedDogProfile.id,
          name: selectedDogProfile.name,
          imageUrl: selectedDogProfile.imageUrl,
          avatar: selectedDogProfile.imageUrl,
          dogName: selectedDogProfile.name,
          joinedAt: new Date().toISOString(),
        };
        
        // Check if dog is already attending
        const isAlreadyAttending = event.attendees.some(a => a.id === selectedDogProfile.id);
        if (!isAlreadyAttending) {
          return {
            ...event,
            attendees: [...event.attendees, newAttendee],
            status: event.attendees.length + 1 >= event.maxAttendees ? 'Full' as EventStatus : 'Open' as EventStatus
          };
        }
      }
      return event;
    });

    setEvents(updatedEvents);
    setIsJoinDialogOpen(false);
    setSelectedEvent(null);
    setSelectedDog(null);
  };

  const handleViewDetails = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setViewingEvent(event);
    }
  };

  const handleShare = (eventId: string) => {
    console.log('Sharing event:', eventId);
  };

  const handleBookmark = (eventId: string) => {
    console.log('Bookmarking event:', eventId);
  };
  
  const handleLocationToggle = (enabled: boolean) => {
    setLocationEnabled(enabled);
    
    if (enabled && !userLocation.latitude) {
      // Get user location when enabled
      setUserLocation({ ...userLocation, loading: true });
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            loading: false,
            error: null,
          });
        },
        (error) => {
          setUserLocation({
            latitude: null,
            longitude: null,
            loading: false,
            error: `Unable to retrieve your location: ${error.message}`,
          });
        }
      );
    }
  };
  
  const handleCreateEvent = async (data: any, imageFile: File | null) => {
    setIsCreatingEvent(true);
    try {
      // Create a new event object
      const newEvent: Event = {
        id: `event-${crypto.randomUUID()}`,
        title: data.title,
        description: data.description,
        shortDescription: data.shortDescription,
        imageUrl: imageFile ? URL.createObjectURL(imageFile) : "https://images.unsplash.com/photo-1558430665-6ddd08021c29?auto=format&fit=crop&q=80&w=3000",
        date: data.date ? format(data.date, "MMM d, yyyy") : new Date().toDateString(),
        time: data.time,
        duration: 60, // Default 1 hour
        location: {
          name: data.locationName,
          address: data.locationAddress,
          coordinates: {
            // Would normally geocode the address to get lat/lng
            // For now, using mock location or random coordinates near user location
            lat: userLocation.latitude ? userLocation.latitude + (Math.random() * 0.01) : 40.7128,
            lng: userLocation.longitude ? userLocation.longitude + (Math.random() * 0.01) : -74.0060
          }
        },
        category: data.category,
        tags: [data.category.toLowerCase()],
        maxAttendees: data.maxAttendees,
        attendees: [],
        host: {
          id: "currentUser", // Would get from auth context
          name: "You", // Would get from user profile
          imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
        },
        status: "Open" as EventStatus,
        gallery: [],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        
        // New dog requirement fields
        difficultyLevel: data.difficultyLevel,
        requiredAbilities: data.requiredAbilities,
        suitableEnergyLevels: data.suitableEnergyLevels,
        suitableDogSizes: data.suitableDogSizes,
        minAge: data.minAge,
        breedRecommendations: data.breedRecommendations,
        notRecommendedFor: data.notRecommendedFor
      };
      
      // Add to events list
      setEvents([newEvent, ...events]);
      
      // Success message
      alert("Event created successfully!");
    } catch (error) {
      console.error("Error creating event", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setIsCreatingEvent(false);
    }
  };

  if (viewingEvent) {
    return (
      <EventDetailsView
        event={viewingEvent}
        onBack={() => setViewingEvent(null)}
        onJoin={handleJoinEvent}
      />
    );
  }

  // Filter events based on search query and category
  const filteredEvents = events.filter(event => {
    // Check if user has joined this event (using mock user ID "currentUser")
    const hasJoined = event.attendees.some(attendee => attendee.id === "currentUser");
    
    // Filter by search query
    const matchesSearch = searchQuery === "" || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    
    // For "all" tab, show only joined events
    return hasJoined && matchesSearch && matchesCategory;
  });
  
  // Calculate days until event starts
  const calculateDaysUntil = (eventDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Parse the event date (format: "Apr 15, 2024")
    const dateComponents = eventDate.split(' ');
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(dateComponents[0]);
    const day = parseInt(dateComponents[1].replace(',', ''));
    const year = parseInt(dateComponents[2]);
    
    const eventDateTime = new Date(year, month, day);
    
    // Calculate difference in days
    const diffTime = eventDateTime.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your upcoming events and activities.
          </p>
        </div>
        
        <CreateEventPostDialog 
          onSubmit={handleCreateEvent}
          isLoading={isCreatingEvent}
        />
      </div>

      <EventFilters
        onSearch={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onSortChange={setSortBy}
        onViewChange={setView}
        onLocationToggle={handleLocationToggle}
        onRadiusChange={setSearchRadius}
        locationEnabled={locationEnabled}
        radius={searchRadius}
        userLocation={userLocation}
      />

      {/* Dog-specific recommendations section */}
      {mockDogs.length > 0 && (
        <div className="border rounded-lg p-4 bg-muted/10">
          <div className="flex gap-2 justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Dog className="h-5 w-5" />
              Personalized Recommendations
            </h2>
            
            {mockDogs.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {mockDogs.map(dog => (
                  <Button
                    key={dog.id}
                    variant={selectedDogForRecommendations?.id === dog.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDogForRecommendations(dog)}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <div className="w-5 h-5 rounded-full overflow-hidden">
                      <img 
                        src={dog.imageUrl} 
                        alt={dog.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {dog.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          {selectedDogForRecommendations && (
            <DogRecommendedEvents
              dog={selectedDogForRecommendations}
              events={events}
              onViewDetails={handleViewDetails}
              maxItems={3}
            />
          )}
        </div>
      )}

      {/* Upcoming Events Highlight Section - Show next 3 events */}
      <div className="border rounded-lg p-5 bg-muted/10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Events
        </h2>
        
        <div className="space-y-4">
          {events
            .sort((a, b) => calculateDaysUntil(a.date) - calculateDaysUntil(b.date))
            .filter(event => calculateDaysUntil(event.date) >= 0)
            .slice(0, 3)
            .map(event => (
              <div 
                key={event.id}
                className="flex items-center gap-4 p-3 border rounded-md bg-background hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={() => handleViewDetails(event.id)}
              >
                <div className="w-14 h-14 rounded-md overflow-hidden">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <Calendar className="w-3.5 h-3.5" /> {event.date} at {event.time}
                  </div>
                </div>
                
                <Badge 
                  variant={calculateDaysUntil(event.date) <= 3 ? "destructive" : calculateDaysUntil(event.date) <= 7 ? "secondary" : "outline"}
                  className="ml-auto"
                >
                  {calculateDaysUntil(event.date) === 0 ? (
                    "Today!"
                  ) : (
                    `${calculateDaysUntil(event.date)} day${calculateDaysUntil(event.date) !== 1 ? 's' : ''}`
                  )}
                </Badge>
              </div>
            ))}
            
          {events.filter(event => calculateDaysUntil(event.date) >= 0).length === 0 && (
            <div className="text-center p-4 text-muted-foreground">
              No upcoming events found. Check back later!
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="all">My Events</TabsTrigger>
          <TabsTrigger value="nearby" className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            Nearby
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {events
              .filter(event => {
                const matchesSearch = searchQuery === "" || 
                  event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  event.location.name.toLowerCase().includes(searchQuery.toLowerCase());
                
                const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
                
                return matchesSearch && matchesCategory;
              })
              .map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onJoin={handleJoinEvent}
                  onViewDetails={handleViewDetails}
                  onShare={handleShare}
                  onBookmark={handleBookmark}
                  matchingDog={selectedDogForRecommendations}
                  daysUntil={calculateDaysUntil(event.date)}
                />
              ))
            }
            
            {events.length === 0 && (
              <div className="md:col-span-2 p-8 text-center border rounded-lg">
                <p className="text-muted-foreground">No events available. Check back later!</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onJoin={handleJoinEvent}
                onViewDetails={handleViewDetails}
                onShare={handleShare}
                onBookmark={handleBookmark}
                matchingDog={selectedDogForRecommendations}
                daysUntil={calculateDaysUntil(event.date)}
              />
            ))}
            
            {filteredEvents.length === 0 && (
              <div className="md:col-span-2 p-8 text-center border rounded-lg">
                <p className="text-muted-foreground">You haven't joined any events yet.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                >
                  Browse all events
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="nearby" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-6">
                {filteredEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onJoin={handleJoinEvent}
                    onViewDetails={handleViewDetails}
                    onShare={handleShare}
                    onBookmark={handleBookmark}
                    matchingDog={selectedDogForRecommendations}
                    daysUntil={calculateDaysUntil(event.date)}
                  />
                ))}
                
                {filteredEvents.length === 0 && (
                  <div className="md:col-span-2 p-8 text-center border rounded-lg">
                    <p className="text-muted-foreground">No events match your current filters.</p>
                    <Button 
                      variant="link" 
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("All");
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <NearbyEventsList
                events={events}
                onViewDetails={handleViewDetails}
                maxDistance={searchRadius}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join Event with Your Dog</DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="py-4">
              <h3 className="font-semibold mb-2">{selectedEvent.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedEvent.date} at {selectedEvent.time}
              </p>
              
              {mockDogs.length === 0 ? (
                <div className="text-center p-4 space-y-3">
                  <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">You need to add a dog profile first</p>
                  <Button variant="outline" onClick={() => setIsJoinDialogOpen(false)}>
                    Add Dog Profile
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <div className="space-y-2">
                    {mockDogs.map((dog) => (
                      <div
                        key={dog.id}
                        className={`flex items-center space-x-4 p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedDog === dog.id
                            ? 'bg-primary/10'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => setSelectedDog(dog.id)}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src={dog.imageUrl}
                            alt={dog.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{dog.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {dog.breed} • {dog.age} years
                          </p>
                        </div>
                        {selectedDog === dog.id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsJoinDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmJoin}
                  disabled={!selectedDog}
                >
                  Join Event
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;