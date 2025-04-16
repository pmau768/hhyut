import { useState, useEffect } from "react";
import { DogProfile, Event } from "@/lib/types";
import { calculateDogEventCompatibility } from "@/lib/dogEventCompatibility";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Dog } from "lucide-react";
import { EventCompatibility } from "./EventCompatibility";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDateForDisplay, getLocationProperty } from "@/lib/utils";

interface DogRecommendedEventsProps {
  dog: DogProfile;
  events: Event[];
  onViewDetails: (eventId: string) => void;
  maxItems?: number;
}

export function DogRecommendedEvents({
  dog,
  events,
  onViewDetails,
  maxItems = 3
}: DogRecommendedEventsProps) {
  const [recommendedEvents, setRecommendedEvents] = useState<Array<Event & { score: number }>>([]);
  const [loading, setLoading] = useState(true);

  // Sort events by compatibility score
  useEffect(() => {
    setLoading(true);
    
    // Calculate compatibility for each event
    const eventsWithScores = events.map(event => ({
      ...event,
      score: calculateDogEventCompatibility(dog, event)
    }));
    
    // Sort by score and take the top maxItems
    const sortedEvents = eventsWithScores
      .sort((a, b) => b.score - a.score)
      .filter(event => event.score > 50) // Only show events with >50% compatibility
      .slice(0, maxItems);
    
    setRecommendedEvents(sortedEvents);
    setLoading(false);
  }, [events, dog, maxItems]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Dog className="h-5 w-5" />
          Recommended for {dog.name}
        </h3>
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

  if (recommendedEvents.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Dog className="h-5 w-5" />
          Recommended for {dog.name}
        </h3>
        <Card className="bg-muted/30">
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground text-sm">
              No recommended events found for {dog.name} at this time
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Check back later for events that match {dog.name}'s profile
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Dog className="h-5 w-5" />
        Recommended for {dog.name}
      </h3>
      
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-3">
          {recommendedEvents.map((event) => (
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
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium line-clamp-1">{event.title}</h4>
                      <EventCompatibility 
                        dog={dog} 
                        event={event} 
                        compact 
                      />
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDateForDisplay(event.date)} • 
                      <Clock className="w-3 h-3 mx-1" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      {typeof event.location === 'string' 
                        ? event.location 
                        : event.location.name}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                      {event.shortDescription}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 