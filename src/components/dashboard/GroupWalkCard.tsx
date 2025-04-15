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
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-xl">Next Group Walk</CardTitle>
        <CardDescription>
          Your next upcoming event
        </CardDescription>
      </CardHeader>
      <CardContent>
        {nextEvent ? (
          <div className="space-y-4">
            <div 
              className="h-40 bg-cover bg-center relative rounded-md overflow-hidden"
              style={{ backgroundImage: `url(${nextEvent.imageUrl || '/images/default-event.jpg'})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white line-clamp-1">
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
                    >
                      {nextEvent.difficultyLevel}
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-white/80 line-clamp-1 mt-1">
                  {nextEvent.shortDescription}
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
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {nextEvent.date} • {nextEvent.time}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                {nextEvent.location.name}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                {nextEvent.attendees.length} / {nextEvent.maxAttendees} attendees
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline">
                View Details
              </Button>
              <Button size="sm">
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