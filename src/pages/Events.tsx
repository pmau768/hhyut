import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "@/domains/events/hooks/useEvents";
import { Event, EventAttendee } from "@/domains/events/types";
import { format } from "date-fns";
import EventCard from "@/components/events/EventCard";
import EventFilters from "@/components/events/EventFilters";
import CreateEventPostDialog from "@/components/events/CreateEventPostDialog";
import NearbyEventsList from "@/components/events/NearbyEventsList";
import { DogRecommendedEvents } from "@/components/events/DogRecommendedEvents";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, Dog, MapPin, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/services/routes";
import { toast } from "sonner";

// Import dog types
import { DogProfile } from "@/lib/types";

const Events = () => {
  const navigate = useNavigate();
  
  // Use our custom events hook for data and operations
  const { 
    events, 
    filteredEvents, 
    loading, 
    error, 
    filters,
    createEvent,
    updateEvent,
    joinEvent: handleJoinEventService,
    leaveEvent,
    getEvent,
    updateFilters,
    resetFilters
  } = useEvents();

  // UI state
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [selectedEventToJoin, setSelectedEventToJoin] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchRadius, setSearchRadius] = useState(5); // In miles
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [selectedDogForRecommendations, setSelectedDogForRecommendations] = useState<DogProfile | null>(null);
  
  // Location state
  const [userLocation, setUserLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
    loading: boolean;
    error: string | null;
  }>({
    latitude: null,
    longitude: null,
    loading: false,
    error: null
  });
  
  // Event creation loading state
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  
  // Dog profiles state
  const [dogs, setDogs] = useState<DogProfile[]>([]);
  
  // Main tab state
  const [mainTab, setMainTab] = useState("browse");
  
  // Load user dogs from localStorage on mount
  useEffect(() => {
    // Load user dogs from localStorage
    const storedDogs = localStorage.getItem('dogs');
    if (storedDogs) {
      try {
        setDogs(JSON.parse(storedDogs));
      } catch (error) {
        console.error("Error parsing dogs from localStorage:", error);
      }
    }
    
    // Get user's location for nearby events
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null
        });
      }, (error) => {
        console.error("Error getting location:", error);
        setUserLocation(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      });
    }
  }, []);

  // Apply search and filters to update the events hook
  useEffect(() => {
    updateFilters({
      searchQuery,
      category: selectedCategory !== "All" ? selectedCategory as any : undefined,
      location: locationEnabled && userLocation.latitude && userLocation.longitude ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        radius: searchRadius
      } : undefined
    });
  }, [searchQuery, selectedCategory, locationEnabled, userLocation, searchRadius, updateFilters]);

  const handleJoinEvent = (eventId: string) => {
    const event = getEvent(eventId);
    if (event) {
      setSelectedEvent(event);
      setSelectedEventToJoin(null); // Reset selected event
      setIsJoinDialogOpen(true);
    }
  };

  const handleConfirmJoin = () => {
    if (!selectedEvent || !selectedEventToJoin) return;

    const selectedDogProfile = dogs.find(d => d.id === selectedEventToJoin);
    if (!selectedDogProfile) return;

    // Create attendee from selected dog
    const newAttendee: EventAttendee = {
      id: selectedDogProfile.id,
      name: selectedDogProfile.name,
      avatar: selectedDogProfile.avatar || selectedDogProfile.imageUrl || "",
      dogName: selectedDogProfile.name,
      joinedAt: new Date().toISOString(),
    };
    
    // Join the event using our domain service
    handleJoinEventService(selectedEvent.id, newAttendee);
    
    // Close dialog
    setIsJoinDialogOpen(false);
    setSelectedEventToJoin(null);
  };

  const handleViewDetails = (eventId: string) => {
    navigate(ROUTES.EVENT_DETAILS(eventId));
  };

  const handleShare = (eventId: string) => {
    const event = getEvent(eventId);
    if (event) {
      const shareData = {
        title: event.title,
        text: event.shortDescription || event.description,
        url: window.location.origin + ROUTES.EVENT_DETAILS(eventId)
      };

      if (navigator.share && navigator.canShare(shareData)) {
        navigator.share(shareData)
          .catch((error) => console.error('Error sharing:', error));
      } else {
        // Fallback - copy link to clipboard
        navigator.clipboard.writeText(shareData.url)
          .then(() => alert('Link copied to clipboard!'))
          .catch((error) => console.error('Error copying to clipboard:', error));
      }
    }
  };

  const handleBookmark = (eventId: string) => {
    // TODO: Implement bookmarking functionality
    console.log('Bookmarking event:', eventId);
  };
  
  const handleLocationToggle = (enabled: boolean) => {
    setLocationEnabled(enabled);
    
    // If enabling location, request the user's location
    if (enabled && navigator.geolocation && !userLocation.latitude) {
      setUserLocation(prev => ({ ...prev, loading: true, error: null }));
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            loading: false,
            error: null
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setUserLocation({
            latitude: null,
            longitude: null,
            loading: false,
            error: error.message
          });
          setLocationEnabled(false); // Turn off location if there's an error
        }
      );
    }
  };
  
  const handleCreateEvent = async (data: any, imageFile: File | null) => {
    setIsCreatingEvent(true);
    try {
      // Create event location
      const location = {
        name: data.locationName,
        address: data.locationAddress,
        coordinates: data.useCurrentLocation && userLocation.latitude && userLocation.longitude
          ? { lat: userLocation.latitude, lng: userLocation.longitude }
          : { lat: 40.7128, lng: -74.0060 } // Default to NYC if no location
      };

      // Process strings that should be arrays
      const breedRecommendations = data.breedRecommendations 
        ? data.breedRecommendations.split(',').map((b: string) => b.trim()) 
        : [];
        
      const notRecommendedFor = data.notRecommendedFor 
        ? data.notRecommendedFor.split(',').map((b: string) => b.trim()) 
        : [];

      // Create tags from the category and other fields
      const tags = [
        data.category.toLowerCase(),
        data.difficultyLevel.toLowerCase(),
        ...data.suitableDogSizes.map((size: string) => `${size.toLowerCase()}-dogs`),
        ...data.suitableEnergyLevels.map((energy: string) => `${energy.toLowerCase()}-energy`)
      ];

      // Create new event
      await createEvent({
        title: data.title,
        description: data.description,
        shortDescription: data.shortDescription,
        date: format(data.date, 'MMM dd, yyyy'),
        time: data.time,
        location,
        category: data.category,
        avatar: imageFile ? URL.createObjectURL(imageFile) : "https://images.unsplash.com/photo-1558430665-6ddd08021c29?auto=format&fit=crop&q=80&w=3000",
        difficultyLevel: data.difficultyLevel,
        requiredAbilities: data.requiredAbilities,
        suitableEnergyLevels: data.suitableEnergyLevels,
        suitableDogSizes: data.suitableDogSizes,
        minAge: data.minAge,
        breedRecommendations,
        notRecommendedFor,
        tags,
        maxAttendees: data.maxAttendees,
        host: {
          id: "current-user", // Should be actual user ID
          name: "Your Name", // Should be actual user name
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" // Should be actual user avatar
        },
        duration: 60, // Default duration
      });
      
      // Show success toast
      toast.success("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      // Show error toast
      toast.error("Failed to create event. Please try again.");
    } finally {
      setIsCreatingEvent(false);
    }
  };

  // Function to calculate days until an event
  const calculateDaysUntil = (eventDate: string) => {
    const today = new Date();
    const date = new Date(eventDate);
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Events</h1>
        <CreateEventPostDialog 
          onSubmit={handleCreateEvent} 
          isLoading={isCreatingEvent} 
        />
      </div>

      <Tabs value={mainTab} onValueChange={setMainTab} defaultValue="browse" className="w-full">
        <TabsList className="grid grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="browse">Browse Events</TabsTrigger>
          <TabsTrigger value="nearby">Nearby</TabsTrigger>
          <TabsTrigger value="recommended">For Your Dog</TabsTrigger>
          <TabsTrigger value="my-events">My Events</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-3">
              <EventFilters
                onSearch={setSearchQuery}
                onCategoryChange={setSelectedCategory}
                onLocationToggle={handleLocationToggle}
                locationEnabled={locationEnabled}
                onRadiusChange={setSearchRadius}
                radius={searchRadius}
                userLocation={userLocation}
                onSortChange={(sort) => console.log('Sort changed:', sort)}
                onViewChange={(view) => console.log('View changed:', view)}
              />
            </div>
            
            {loading ? (
              <div className="col-span-3 flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="col-span-3 bg-destructive/10 p-4 rounded-lg flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p>Error loading events. Please try again later.</p>
              </div>
            ) : (
              <>
                <div className="lg:col-span-3">
                  <h2 className="font-semibold text-lg mb-4">Upcoming Events</h2>
                  
                  {filteredEvents.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredEvents
                        .sort((a, b) => calculateDaysUntil(a.date) - calculateDaysUntil(b.date))
                        .filter(event => calculateDaysUntil(event.date) >= 0)
                        .map((event) => (
                          <EventCard
                            key={event.id}
                            event={event}
                            onViewDetails={handleViewDetails}
                            onJoin={handleJoinEvent}
                            onShare={handleShare}
                            onBookmark={handleBookmark}
                            daysUntil={calculateDaysUntil(event.date)}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="bg-muted p-6 rounded-lg text-center">
                      <p className="text-muted-foreground">No events found matching your criteria.</p>
                      <Button variant="link" onClick={resetFilters}>Clear filters</Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="nearby" className="space-y-6 mt-6">
          <NearbyEventsList 
            userLocation={userLocation}
            onViewDetails={handleViewDetails}
            onJoin={handleJoinEvent}
          />
        </TabsContent>

        <TabsContent value="recommended" className="space-y-6 mt-6">
          {dogs.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <label htmlFor="dog-select" className="text-sm font-medium">
                  Select a dog:
                </label>
                <select
                  id="dog-select"
                  className="rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={selectedDogForRecommendations?.id || ''}
                  onChange={(e) => {
                    const dogId = e.target.value;
                    const dog = dogs.find((d) => d.id === dogId) || null;
                    setSelectedDogForRecommendations(dog);
                  }}
                >
                  <option value="">Select a dog</option>
                  {dogs.map((dog) => (
                    <option key={dog.id} value={dog.id}>
                      {dog.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDogForRecommendations ? (
                <DogRecommendedEvents 
                  dog={selectedDogForRecommendations}
                  events={filteredEvents}
                  onViewDetails={handleViewDetails}
                  onJoin={handleJoinEvent}
                />
              ) : (
                <div className="bg-muted p-6 rounded-lg text-center">
                  <p className="text-muted-foreground">Select a dog to see recommended events.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-muted p-6 rounded-lg text-center">
              <p className="text-muted-foreground">You need to add a dog profile first.</p>
              <Button variant="link" className="mt-2" asChild>
                <a href="/my-dogs">Add a Dog</a>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-events" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-3">
              <Tabs defaultValue="attending">
                <TabsList>
                  <TabsTrigger value="attending">Attending</TabsTrigger>
                  <TabsTrigger value="hosting">Hosting</TabsTrigger>
                  <TabsTrigger value="past">Past Events</TabsTrigger>
                </TabsList>
                
                <TabsContent value="attending" className="mt-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEvents
                      .filter(event => event.attendees?.some(attendee => attendee.id === "currentUser"))
                      .map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onViewDetails={handleViewDetails}
                          onJoin={handleJoinEvent}
                          onShare={handleShare}
                          onBookmark={handleBookmark}
                          daysUntil={calculateDaysUntil(event.date)}
                        />
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="hosting" className="mt-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEvents
                      .filter(event => event.host?.id === "current-user")
                      .map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onViewDetails={handleViewDetails}
                          onJoin={handleJoinEvent}
                          onShare={handleShare}
                          onBookmark={handleBookmark}
                          daysUntil={calculateDaysUntil(event.date)}
                        />
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="past" className="mt-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEvents
                      .filter(event => calculateDaysUntil(event.date) < 0)
                      .filter(event => 
                        event.attendees?.some(attendee => attendee.id === "currentUser") ||
                        event.host?.id === "current-user"
                      )
                      .map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onViewDetails={handleViewDetails}
                          onJoin={handleJoinEvent}
                          onShare={handleShare}
                          onBookmark={handleBookmark}
                          daysUntil={calculateDaysUntil(event.date)}
                        />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Join event dialog */}
      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Join Event</DialogTitle>
          </DialogHeader>
          <div className="my-6 space-y-4">
            {selectedEvent && (
              <>
                <h3 className="font-semibold mb-2">{selectedEvent.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{selectedEvent.date} at {selectedEvent.time}</span>
                </div>
                <p>Select a dog to join with:</p>
                <div className="grid gap-4 py-4">
                  <ScrollArea className="h-72">
                    <div className="space-y-4">
                      {dogs.map((dog) => {
                        // Check if dog is already attending
                        const isAttending = selectedEvent.attendees?.some(
                          (a) => a.id === dog.id
                        );
                        
                        return (
                          <div
                            key={dog.id}
                            className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedEventToJoin === dog.id
                                ? "border-primary bg-primary/10"
                                : "hover:border-primary/50"
                            } ${isAttending ? "opacity-50" : ""}`}
                            onClick={() => {
                              if (!isAttending) {
                                setSelectedEventToJoin(dog.id);
                              }
                            }}
                          >
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                              <img
                                src={dog.avatar || dog.imageUrl}
                                alt={dog.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{dog.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {dog.breed}, {dog.age} years
                              </p>
                            </div>
                            {isAttending ? (
                              <Badge variant="outline" className="ml-auto">
                                <Check className="h-3 w-3 mr-1" />
                                Joined
                              </Badge>
                            ) : selectedEventToJoin === dog.id ? (
                              <div className="h-4 w-4 rounded-full bg-primary"></div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsJoinDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmJoin}
              disabled={!selectedEventToJoin}
            >
              Join Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;