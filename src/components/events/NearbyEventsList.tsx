import { useState, useEffect } from "react";
import { Event } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocateIcon, Calendar, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface NearbyEventsListProps {
  events: Event[];
  onViewDetails: (eventId: string) => void;
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
  events,
  onViewDetails,
  maxDistance = 10,
}: NearbyEventsListProps) => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
    loading: boolean;
    error: string | null;
  }>({
    latitude: null,
    longitude: null,
    loading: true,
    error: null,
  });

  const [nearbyEvents, setNearbyEvents] = useState<
    Array<Event & { distance: number }>
  >([]);

  // Get user's location when component mounts
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation({
        latitude: null,
        longitude: null,
        loading: false,
        error: "Geolocation is not supported by your browser",
      });
      return;
    }

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
  }, []);

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

  if (userLocation.loading) {
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
              onClick={() => {
                setUserLocation({
                  latitude: null,
                  longitude: null,
                  loading: true,
                  error: null,
                });
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
              }}
            >
              Try Again
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Events Near You</h3>
      <div className="space-y-3">
        {nearbyEvents.map((event) => (
          <Card 
            key={event.id}
            className="hover:bg-muted/10 transition-colors cursor-pointer"
            onClick={() => onViewDetails(event.id)}
          >
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div 
                  className="w-16 h-16 rounded-md bg-cover bg-center"
                  style={{ backgroundImage: `url(${event.imageUrl})` }}
                />
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium line-clamp-1">{event.title}</h4>
                    <Badge variant="outline">
                      {event.distance} km
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {event.date} • 
                    <Clock className="w-3 h-3 mx-1" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <LocateIcon className="w-3 h-3 mr-1" />
                    {event.location.name}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NearbyEventsList; 