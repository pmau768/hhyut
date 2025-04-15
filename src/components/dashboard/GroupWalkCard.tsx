// import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock3, Users, MapPin, Calendar } from "lucide-react";
import { Event } from "@/lib/types";

interface GroupWalkCardProps {
  nextEvent: Event | null;
  daysUntil?: number; 
}

export const GroupWalkCard = ({ nextEvent, daysUntil }: GroupWalkCardProps) => {
  return (
    <Card>
      <CardHeader className="px-4 sm:px-6 pb-3 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Next Group Walk</CardTitle>
        <CardDescription>
          Your next upcoming event
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pt-0">
        {nextEvent ? (
          <div className="space-y-3 sm:space-y-4">
            <div 
              className="h-32 sm:h-40 bg-cover bg-center relative rounded-md overflow-hidden"
              style={{ backgroundImage: `url(${nextEvent.imageUrl || '/images/default-event.jpg'})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                    {nextEvent.title}
                  </h3>
                  
                  {/* Difficulty level badge */}
                  {nextEvent.difficultyLevel && (
                    <Badge 
                      variant={
                        nextEvent.difficultyLevel === "Easy" 
                          ? "default"
                          : nextEvent.difficultyLevel === "Moderate"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {nextEvent.difficultyLevel}
                    </Badge>
                  )}
                </div>
                
                <div className="text-xs sm:text-sm text-white/80 line-clamp-1 mt-1">
                  {nextEvent.shortDescription}
                </div>
              </div>
              
              {/* Countdown Badge */}
              {typeof daysUntil === 'number' && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
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
            
            <div className="space-y-2">
              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{nextEvent.date} • {nextEvent.time}</span>
              </div>
              
              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{nextEvent.location.name}</span>
              </div>
              
              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{nextEvent.attendees.length} / {nextEvent.maxAttendees} attendees</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-1">
              <Button size="sm" variant="outline" className="w-full sm:w-auto">
                View Details
              </Button>
              <Button size="sm" className="w-full sm:w-auto">
                Join Event
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 space-y-3">
            <p className="text-muted-foreground text-center">
              You don't have any upcoming group walks
            </p>
            <Button size="sm">Find Events</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};