import { Event, DogProfile } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Share2, Bookmark, Clock3 } from "lucide-react";
import { EventCompatibility } from "./EventCompatibility";
import { formatDateForDisplay, getLocationProperty } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  onJoin: (eventId: string) => void;
  onViewDetails: (eventId: string) => void;
  onShare: (eventId: string) => void;
  onBookmark: (eventId: string) => void;
  matchingDog?: DogProfile | null;
  daysUntil?: number;
}

const EventCard = ({ 
  event, 
  onJoin, 
  onViewDetails, 
  onShare, 
  onBookmark,
  matchingDog,
  daysUntil
}: EventCardProps) => {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div 
        className="h-40 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${event.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white line-clamp-1">
              {event.title}
            </h3>
            
            {/* Difficulty level badge */}
            {event.difficultyLevel && (
              <Badge 
                variant={
                  event.difficultyLevel === "Easy" 
                    ? "default"
                    : event.difficultyLevel === "Moderate"
                    ? "secondary"
                    : "destructive"
                }
              >
                {event.difficultyLevel}
              </Badge>
            )}
          </div>
          
          <div className="text-sm text-white/80 line-clamp-1 mt-1">
            {event.shortDescription}
          </div>
        </div>
        
        {/* Countdown Badge */}
        {typeof daysUntil === 'number' && (
          <div className="absolute top-3 right-3">
            <Badge 
              variant={daysUntil <= 3 ? "destructive" : daysUntil <= 7 ? "secondary" : "outline"}
              className="text-xs font-semibold bg-black/70 backdrop-blur-sm border-none text-white"
            >
              {daysUntil === 0 ? (
                "Today!"
              ) : daysUntil < 0 ? (
                "Passed"
              ) : (
                <>
                  <Clock3 className="w-3 h-3 mr-1" />
                  {daysUntil} day{daysUntil !== 1 ? 's' : ''} until event
                </>
              )}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="space-y-1 mb-3">
          {/* Date and time */}
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <Calendar className="mr-1 h-3.5 w-3.5" />
            {formatDateForDisplay(event.date)} • {event.time}
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <MapPin className="mr-1 h-3.5 w-3.5" />
            {getLocationProperty(event.location, 'name')}
          </div>

          {/* Attendees */}
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <Users className="mr-1 h-3.5 w-3.5" />
            {event.attendees?.length || 0} / {event.maxAttendees || 0} attendees
          </div>
        </div>
        
        {/* Dog compatibility section */}
        {matchingDog && (
          <div className="mb-4 mt-1 border-t pt-3">
            <EventCompatibility 
              dog={matchingDog}
              event={event}
            />
          </div>
        )}
        
        <div className="flex gap-2 mt-auto pt-4">
          <Button 
            variant="default" 
            className="flex-1"
            onClick={() => onViewDetails(event.id)}
          >
            View Details
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onJoin(event.id)}
          >
            Join
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onShare(event.id);
            }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onBookmark(event.id);
            }}
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;