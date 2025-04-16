import { Event, DogProfile } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Share2, Bookmark, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/lib/services/routes";
import { EventCompatibility } from "./EventCompatibility";
import { formatDateForDisplay, getLocationProperty } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  onJoin: (eventId: string) => void;
  onViewDetails?: (eventId: string) => void;
  onShare?: (eventId: string) => void;
  onBookmark?: (eventId: string) => void;
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
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative w-full h-48 overflow-hidden">
        <Link to={ROUTES.EVENT_DETAILS(event.id)}>
          <img 
            src={event.avatar || event.imageUrl || "https://via.placeholder.com/400x200"} 
            alt={event.title}
            className="w-full h-full object-cover transition-transform hover:scale-105" 
          />
        </Link>
        {daysUntil !== undefined && daysUntil <= 3 && daysUntil >= 0 && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            {daysUntil === 0 ? "Today" : `${daysUntil} day${daysUntil !== 1 ? 's' : ''}`}
          </Badge>
        )}
        <Badge variant="secondary" className="absolute top-2 left-2">
          {event.category}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <Link 
          to={ROUTES.EVENT_DETAILS(event.id)}
          className="text-lg font-semibold leading-tight hover:underline"
        >
          {event.title}
        </Link>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDateForDisplay(event.date)} {event.time && `• ${event.time}`}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{getLocationProperty(event.location, 'name')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span>
            {event.attendees?.length || 0} / {event.maxAttendees || 0} attendees
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        {/* Dog compatibility section */}
        {matchingDog && (
          <div className="mb-4 mt-1 border-t pt-3">
            <EventCompatibility 
              dog={matchingDog}
              event={event}
            />
          </div>
        )}
        <p className="text-muted-foreground text-sm line-clamp-2">
          {event.shortDescription || event.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between">
        <div className="flex space-x-1">
          {onShare && (
            <Button variant="ghost" size="icon" onClick={() => onShare(event.id)}>
              <Share2 className="h-4 w-4" />
            </Button>
          )}
          {onBookmark && (
            <Button variant="ghost" size="icon" onClick={() => onBookmark(event.id)}>
              <Bookmark className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={ROUTES.EVENT_DETAILS(event.id)}>
              <ExternalLink className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>
          <Button size="sm" onClick={() => onJoin(event.id)}>
            Join
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;