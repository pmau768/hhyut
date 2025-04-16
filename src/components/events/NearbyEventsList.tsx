import { useState, useEffect } from "react";
import { Event } from "@/domains/events/types";
import { useEvents } from "@/domains/events/hooks/useEvents";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocateIcon, Calendar, Clock, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface NearbyEventsListProps {
  userLocation: {
    latitude: number | null;
    longitude: number | null;
    loading: boolean;
    error: string | null;
  };
  onViewDetails: (eventId: string) => void;
  onJoin?: (eventId: string) => void;
  maxDistance?: number; // in kilometers
}

// Helper function to calculate distance between two coordinates (haversine formula)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return Math.round(distance * 10) / 10;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

const NearbyEventsList = ({
  userLocation,
  onViewDetails,
  onJoin,
  maxDistance = 10,
}: NearbyEventsListProps) => {
  // Use events hook instead of passing events as props
  const { events, loading, error } = useEvents();
  const [nearbyEvents, setNearbyEvents] = useState<Array<Event & { distance: number }>>([]);

  // Calculate days until event starts
  const calculateDaysUntil = (eventDate: string) => {
    const today = new Date();
    const date = new Date(eventDate);
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter events by distance when user location or events change
  useEffect(() => {
    if (
      userLocation.latitude === null ||
      userLocation.longitude === null ||
      userLocation.loading ||
      userLocation.error
    ) {
      return;
    }

    const eventsWithDistance = events
      .map((event) => {
        if (!event.location.coordinates) {
          return { ...event, distance: Infinity };
        }
        
        const distance = calculateDistance(
          userLocation.latitude!,
          userLocation.longitude!,
          event.location.coordinates.lat,
          event.location.coordinates.lng
        );
        return { ...event, distance };
      })
      .filter((event) => event.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);

    setNearbyEvents(eventsWithDistance);
  }, [events, userLocation, maxDistance]);

  if (loading || userLocation.loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Events Near You</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Skeleton className="w-16 h-16 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (userLocation.error) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Events Near You</h3>
        <Card className="bg-muted/30">
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground text-sm">
              {userLocation.error}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Events Near You</h3>
        <Card className="bg-muted/30">
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground text-sm">
              Error loading events. Please try again.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={() => window.location.reload()}
            >
              Reload
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (nearbyEvents.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Events Near You</h3>
        <Card className="bg-muted/30">
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground text-sm">
              No events found within {maxDistance} km of your location
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Events Near You</h3>
        <span className="text-xs text-muted-foreground">
          Within {maxDistance} km
        </span>
      </div>

      <div className="space-y-4">
        {nearbyEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <div className="flex">
              {/* Event image */}
              <div 
                className="w-24 h-auto bg-cover bg-center hidden sm:block"
                style={{ backgroundImage: `url(${event.avatar})` }}
              />
              
              {/* Event details */}
              <CardContent className="p-4 flex-1">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold line-clamp-1 flex-1" onClick={() => onViewDetails(event.id)}>
                        {event.title}
                      </h4>
                      <Badge variant="outline" className="ml-2">
                        {event.distance} km
                      </Badge>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {event.date} •
                    </div>
                    
                    <div className="mt-1 flex items-center text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {event.time}
                    </div>
                    
                    <div className="mt-1 flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      {event.location.name}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <Badge variant="secondary">
                      {event.category}
                    </Badge>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onViewDetails(event.id)}
                      >
                        Details
                      </Button>
                      
                      {onJoin && (
                        <Button 
                          size="sm" 
                          onClick={() => onJoin(event.id)}
                          disabled={event.status === 'Full'}
                        >
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NearbyEventsList; 