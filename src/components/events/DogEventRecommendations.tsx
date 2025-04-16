import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, AlertCircle, Calendar, MapPin, Clock, Users } from "lucide-react";
import { DogProfile, Event, DogAbility, DifficultyLevel } from "@/lib/types";
import { format } from "date-fns";

interface DogEventRecommendationsProps {
  dog: DogProfile;
  events: Event[];
  onViewEvent: (eventId: string) => void;
  onJoinEvent: (eventId: string, dogId: string) => void;
}

type RecommendationScore = {
  eventId: string;
  score: number;
  matchReasons: string[];
  nonIdealReasons: string[];
};

const DogEventRecommendations: React.FC<DogEventRecommendationsProps> = ({ 
  dog, 
  events, 
  onViewEvent, 
  onJoinEvent 
}) => {
  // Calculate recommendation scores based on dog profile
  const getRecommendationScores = (dog: DogProfile, events: Event[]): RecommendationScore[] => {
    return events.map(event => {
      const matchReasons: string[] = [];
      const nonIdealReasons: string[] = [];
      let score = 50; // Base score
      
      // Energy level match
      if (event.suitableEnergyLevels?.includes(dog.energy)) {
        score += 15;
        matchReasons.push(`Energy level match (${dog.energy})`);
      } else if (event.suitableEnergyLevels && !event.suitableEnergyLevels.includes(dog.energy)) {
        score -= 10;
        nonIdealReasons.push(`Energy level mismatch (${dog.energy} vs ${event.suitableEnergyLevels.join('/')})`);
      }
      
      // Age requirements
      if (event.minAge && dog.age * 12 < event.minAge) { // Convert dog years to months
        score -= 20;
        nonIdealReasons.push(`Dog is too young (${dog.age} years vs min ${event.minAge/12} years)`);
      }
      
      // Breed match
      if (event.breedRecommendations?.includes(dog.breed)) {
        score += 10;
        matchReasons.push(`Breed is recommended (${dog.breed})`);
      }
      
      // Off-leash compatibility
      if (event.requiredAbilities?.includes("OffLeash") && dog.isGoodOffLeash) {
        score += 10;
        matchReasons.push("Good off-leash skills");
      } else if (event.requiredAbilities?.includes("OffLeash") && !dog.isGoodOffLeash) {
        score -= 15;
        nonIdealReasons.push("Requires off-leash reliability");
      }
      
      // Size compatibility if specified
      if (event.suitableDogSizes) {
        const sizeMap: Record<string, string[]> = {
          "Chihuahua": ["Small"],
          "Pomeranian": ["Small"],
          "Yorkshire Terrier": ["Small"],
          "Pug": ["Small"],
          "Beagle": ["Small", "Medium"],
          "Malinois": ["Medium", "Large"],
          "Labrador": ["Medium", "Large"],
          "Golden Retriever": ["Medium", "Large"],
          "German Shepherd": ["Large"]
        };
        
        const dogSize = sizeMap[dog.breed] || ["Medium"];
        const anyMatch = dogSize.some(size => 
          event.suitableDogSizes?.includes(size as any) || event.suitableDogSizes?.includes("Any")
        );
        
        if (anyMatch) {
          score += 10;
          matchReasons.push("Size compatibility");
        } else {
          score -= 10;
          nonIdealReasons.push("Size incompatibility");
        }
      }
      
      // Difficulty match
      if (event.difficultyLevel) {
        const difficultyMap: Record<DifficultyLevel, number> = {
          "Easy": 1,
          "Moderate": 2,
          "Challenging": 3
        };
        
        const energyLevelMap: Record<string, number> = {
          "Low": 1,
          "Medium": 2,
          "High": 3
        };
        
        const difficultyValue = difficultyMap[event.difficultyLevel];
        const energyValue = energyLevelMap[dog.energy];
        
        if (difficultyValue <= energyValue) {
          score += 10;
          matchReasons.push(`Appropriate difficulty level (${event.difficultyLevel})`);
        } else if (difficultyValue > energyValue + 1) {
          score -= 15;
          nonIdealReasons.push(`Difficulty level may be too high (${event.difficultyLevel})`);
        }
      }
      
      // Cap score between 0-100
      score = Math.max(0, Math.min(100, score));
      
      return {
        eventId: event.id,
        score,
        matchReasons,
        nonIdealReasons
      };
    });
  };
  
  const recommendationScores = getRecommendationScores(dog, events);
  
  // Sort events by recommendation score
  const sortedEvents = [...events]
    .map(event => {
      const scoreInfo = recommendationScores.find(r => r.eventId === event.id);
      return { ...event, recommendationScore: scoreInfo };
    })
    .sort((a, b) => (b.recommendationScore?.score || 0) - (a.recommendationScore?.score || 0));
  
  // Group events by recommendation level
  const highRecommendations = sortedEvents.filter(e => (e.recommendationScore?.score || 0) >= 80);
  const mediumRecommendations = sortedEvents.filter(e => {
    const score = e.recommendationScore?.score || 0;
    return score >= 60 && score < 80;
  });
  const lowRecommendations = sortedEvents.filter(e => (e.recommendationScore?.score || 0) < 60);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Recommended Events for {dog.name}</h2>
        <p className="text-muted-foreground">
          Events tailored to {dog.name}'s age, energy level, and preferences
        </p>
      </div>
      
      {highRecommendations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Highly Recommended
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {highRecommendations.map(event => (
              <RecommendedEventCard
                key={event.id}
                event={event}
                dog={dog}
                recommendationScore={event.recommendationScore!}
                onViewEvent={onViewEvent}
                onJoinEvent={onJoinEvent}
              />
            ))}
          </div>
        </div>
      )}
      
      {mediumRecommendations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            Good Matches
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mediumRecommendations.map(event => (
              <RecommendedEventCard
                key={event.id}
                event={event}
                dog={dog}
                recommendationScore={event.recommendationScore!}
                onViewEvent={onViewEvent}
                onJoinEvent={onJoinEvent}
              />
            ))}
          </div>
        </div>
      )}
      
      {lowRecommendations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Other Events
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lowRecommendations.slice(0, 3).map(event => (
              <RecommendedEventCard
                key={event.id}
                event={event}
                dog={dog}
                recommendationScore={event.recommendationScore!}
                onViewEvent={onViewEvent}
                onJoinEvent={onJoinEvent}
              />
            ))}
          </div>
        </div>
      )}
      
      {sortedEvents.length === 0 && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No Events Found</CardTitle>
            <CardDescription>
              There are no upcoming events available at this time.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline">Refresh</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

interface RecommendedEventCardProps {
  event: Event & { recommendationScore?: RecommendationScore };
  dog: DogProfile;
  recommendationScore: RecommendationScore;
  onViewEvent: (eventId: string) => void;
  onJoinEvent: (eventId: string, dogId: string) => void;
}

const RecommendedEventCard: React.FC<RecommendedEventCardProps> = ({ 
  event, 
  dog, 
  recommendationScore, 
  onViewEvent, 
  onJoinEvent 
}) => {
  const isHighlyRecommended = recommendationScore.score >= 80;
  const isMediumRecommended = recommendationScore.score >= 60 && recommendationScore.score < 80;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-base">{event.title}</CardTitle>
            <CardDescription>{event.shortDescription}</CardDescription>
          </div>
          <Badge className={`${isHighlyRecommended ? 'bg-green-100 text-green-800 hover:bg-green-100' : isMediumRecommended ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : 'bg-amber-100 text-amber-800 hover:bg-amber-100'}`}>
            {recommendationScore.score}% Match
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline">{event.category}</Badge>
          {event.difficultyLevel && (
            <Badge variant="outline">{event.difficultyLevel}</Badge>
          )}
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{event.date}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{event.location.name}</span>
          </div>
          
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{event.attendees.length}/{event.maxAttendees} attending</span>
          </div>
        </div>
        
        {/* Recommendation reasons */}
        {recommendationScore.matchReasons.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium text-green-600 mb-1">Why we recommend this:</p>
            <ul className="text-xs space-y-1">
              {recommendationScore.matchReasons.slice(0, 2).map((reason, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {recommendationScore.nonIdealReasons.length > 0 && (
          <div className={recommendationScore.matchReasons.length > 0 ? "pt-1" : "pt-2 border-t"}>
            <p className="text-sm font-medium text-amber-600 mb-1">Considerations:</p>
            <ul className="text-xs space-y-1">
              {recommendationScore.nonIdealReasons.slice(0, 1).map((reason, i) => (
                <li key={i} className="flex items-start">
                  <AlertCircle className="h-3 w-3 text-amber-500 mr-1 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-3">
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => onJoinEvent(event.id, dog.id)}
        >
          Join Event
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onViewEvent(event.id)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DogEventRecommendations; 