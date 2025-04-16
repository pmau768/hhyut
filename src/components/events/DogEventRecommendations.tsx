import { useState, useEffect } from "react";
import { Event, DogProfile, EventCategory } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DogEventRecommendationsProps {
  dog: DogProfile;
  events: Event[];
  onViewEvent: (eventId: string) => void;
  onJoinEvent: (eventId: string, dogId: string) => void;
}

interface ScoredEvent {
  event: Event;
  score: number;
  matchReasons: string[];
}

const DogEventRecommendations = ({ dog, events, onViewEvent, onJoinEvent }: DogEventRecommendationsProps) => {
  const [recommendedEvents, setRecommendedEvents] = useState<Record<string, ScoredEvent[]>>({
    training: [],
    playdates: [],
    dogParks: [],
    competitions: [],
  });

  useEffect(() => {
    if (!dog || events.length === 0) return;

    // Score and categorize events
    const scoredEvents = events.map(event => {
      const { score, matchReasons } = scoreEventForDog(event, dog);
      return { event, score, matchReasons };
    }).filter(e => e.score > 0);

    // Group by category
    const grouped = {
      training: scoredEvents.filter(e => e.event.category === "TRAINING" && e.score > 30).sort((a, b) => b.score - a.score),
      playdates: scoredEvents.filter(e => e.event.category === "PLAYDATE" && e.score > 40).sort((a, b) => b.score - a.score),
      dogParks: scoredEvents.filter(e => e.event.category === "DOG_PARK" && e.score > 20).sort((a, b) => b.score - a.score),
      competitions: scoredEvents.filter(e => e.event.category === "COMPETITION" && e.score > 50).sort((a, b) => b.score - a.score),
    };

    setRecommendedEvents(grouped);
  }, [dog, events]);

  // Score an event's compatibility with a dog
  const scoreEventForDog = (event: Event, dog: DogProfile): { score: number; matchReasons: string[] } => {
    const matchReasons: string[] = [];
    let score = 0;

    // Base scoring
    if (event.category === "TRAINING") {
      // Check if the training class is appropriate for the dog's age and skill level
      if (event.requirements?.minAge && event.requirements.minAge <= dog.age) {
        score += 20;
        matchReasons.push("Age-appropriate training");
      }
      
      if (event.requirements?.maxAge && event.requirements.maxAge >= dog.age) {
        score += 10;
      }
      
      // Match training level
      if (event.requirements?.trainingLevel) {
        const dogLevel = determineDogTrainingLevel(dog);
        if (event.requirements.trainingLevel === dogLevel) {
          score += 30;
          matchReasons.push(`Perfect ${dogLevel} training level match`);
        } else if (
          (event.requirements.trainingLevel === "BEGINNER" && dogLevel === "INTERMEDIATE") ||
          (event.requirements.trainingLevel === "INTERMEDIATE" && dogLevel === "ADVANCED")
        ) {
          score += 15;
          matchReasons.push("May be too basic for your dog's skills");
        }
      }
      
      // Match specific behaviors the dog needs help with
      if (event.tags?.some(tag => 
        dog.behaviorNotes?.toLowerCase().includes(tag.toLowerCase())
      )) {
        score += 25;
        matchReasons.push("Addresses behavior issues your dog has");
      }
    }
    
    else if (event.category === "PLAYDATE") {
      // Check compatibility with dog energy level
      if (event.requirements?.energyLevel && event.requirements.energyLevel === dog.energyLevel) {
        score += 30;
        matchReasons.push(`Perfect energy level match: ${dog.energyLevel}`);
      } else if (
        event.requirements?.energyLevel &&
        (
          (event.requirements.energyLevel === "MODERATE" && 
           (dog.energyLevel === "LOW" || dog.energyLevel === "HIGH")) ||
          (event.requirements.energyLevel === "HIGH" && dog.energyLevel === "MODERATE") ||
          (event.requirements.energyLevel === "LOW" && dog.energyLevel === "MODERATE")
        )
      ) {
        score += 15;
        matchReasons.push("Compatible energy levels");
      }
      
      // Check size compatibility
      if (event.requirements?.dogSize) {
        if (event.requirements.dogSize === dog.size) {
          score += 20;
          matchReasons.push(`Perfect size match: ${dog.size}`);
        } else if (
          (event.requirements.dogSize === "MEDIUM" && 
           (dog.size === "SMALL" || dog.size === "LARGE"))
        ) {
          score += 10;
        }
      }
      
      // Check age compatibility
      if (event.requirements?.minAge && event.requirements.maxAge) {
        if (dog.age >= event.requirements.minAge && dog.age <= event.requirements.maxAge) {
          score += 20;
          matchReasons.push(`Age-appropriate: ${dog.age} years old`);
        }
      }
      
      // Breed preferences (if any)
      if (event.requirements?.breeds && event.requirements.breeds.includes(dog.breed)) {
        score += 15;
        matchReasons.push(`Breed match: ${dog.breed}`);
      }
    }
    
    else if (event.category === "DOG_PARK") {
      // Almost all dog parks are fine for most dogs
      score += 20;
      
      // Higher score for dog parks that match the dog's energy level
      if (event.tags?.includes(dog.energyLevel)) {
        score += 20;
        matchReasons.push(`Good for ${dog.energyLevel} energy dogs`);
      }
      
      // Size-specific areas
      if (event.tags?.includes(dog.size)) {
        score += 15;
        matchReasons.push(`Has ${dog.size} dog area`);
      }
      
      // Special amenities that match dog preferences
      if (dog.likes && event.tags) {
        const likesLower = dog.likes.map(l => l.toLowerCase());
        const tagsLower = event.tags.map(t => t.toLowerCase());
        
        const matches = likesLower.filter(like => 
          tagsLower.some(tag => tag.includes(like))
        );
        
        if (matches.length > 0) {
          score += 15 * matches.length;
          matchReasons.push(`Has ${matches.join(", ")} that your dog likes`);
        }
      }
    }
    
    else if (event.category === "COMPETITION") {
      // Check if dog meets competition requirements
      if (event.requirements?.breeds && !event.requirements.breeds.includes(dog.breed)) {
        // Dog breed not eligible
        return { score: 0, matchReasons: [] };
      }
      
      if (event.requirements?.minAge && event.requirements.minAge > dog.age) {
        // Dog too young
        return { score: 0, matchReasons: [] };
      }
      
      if (event.requirements?.maxAge && event.requirements.maxAge < dog.age) {
        // Dog too old
        return { score: 0, matchReasons: [] };
      }
      
      // Appropriate competition
      score += 50;
      matchReasons.push(`${dog.breed} eligible for this competition`);
      
      // Competition type match
      if (event.tags?.some(tag => dog.skills?.includes(tag))) {
        score += 30;
        matchReasons.push("Matches your dog's skills");
      }
    }

    return { score, matchReasons };
  };

  // Helper to determine dog's training level based on age, known commands, etc.
  const determineDogTrainingLevel = (dog: DogProfile): "BEGINNER" | "INTERMEDIATE" | "ADVANCED" => {
    // Simple determination logic - could be more sophisticated in a real app
    if (!dog.skills || dog.skills.length <= 3) {
      return "BEGINNER";
    } else if (dog.skills.length <= 8) {
      return "INTERMEDIATE";
    } else {
      return "ADVANCED";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-2">
        <h2 className="text-2xl font-bold">Events Recommended for {dog.name}</h2>
        <p className="text-muted-foreground">
          Based on {dog.name}'s breed, age, energy level, and preferences
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="playdates">Playdates</TabsTrigger>
          <TabsTrigger value="dogParks">Dog Parks</TabsTrigger>
          <TabsTrigger value="competitions">Competitions</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(recommendedEvents)
              .flat()
              .sort((a, b) => b.score - a.score)
              .slice(0, 6)
              .map(({ event, score, matchReasons }) => (
                <RecommendedEventCard
                  key={event.id}
                  event={event}
                  score={score}
                  matchReasons={matchReasons}
                  onViewEvent={onViewEvent}
                  onJoinEvent={() => onJoinEvent(event.id, dog.id)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedEvents.training.length > 0 ? (
              recommendedEvents.training.map(({ event, score, matchReasons }) => (
                <RecommendedEventCard
                  key={event.id}
                  event={event}
                  score={score}
                  matchReasons={matchReasons}
                  onViewEvent={onViewEvent}
                  onJoinEvent={() => onJoinEvent(event.id, dog.id)}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-8">
                No training events found matching {dog.name}'s profile.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="playdates" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedEvents.playdates.length > 0 ? (
              recommendedEvents.playdates.map(({ event, score, matchReasons }) => (
                <RecommendedEventCard
                  key={event.id}
                  event={event}
                  score={score}
                  matchReasons={matchReasons}
                  onViewEvent={onViewEvent}
                  onJoinEvent={() => onJoinEvent(event.id, dog.id)}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-8">
                No playdate events found matching {dog.name}'s profile.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="dogParks" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedEvents.dogParks.length > 0 ? (
              recommendedEvents.dogParks.map(({ event, score, matchReasons }) => (
                <RecommendedEventCard
                  key={event.id}
                  event={event}
                  score={score}
                  matchReasons={matchReasons}
                  onViewEvent={onViewEvent}
                  onJoinEvent={() => onJoinEvent(event.id, dog.id)}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-8">
                No dog park events found matching {dog.name}'s profile.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="competitions" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedEvents.competitions.length > 0 ? (
              recommendedEvents.competitions.map(({ event, score, matchReasons }) => (
                <RecommendedEventCard
                  key={event.id}
                  event={event}
                  score={score}
                  matchReasons={matchReasons}
                  onViewEvent={onViewEvent}
                  onJoinEvent={() => onJoinEvent(event.id, dog.id)}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-8">
                No competition events found matching {dog.name}'s profile.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const RecommendedEventCard = ({ 
  event, 
  score, 
  matchReasons, 
  onViewEvent, 
  onJoinEvent 
}: { 
  event: Event; 
  score: number; 
  matchReasons: string[];
  onViewEvent: (eventId: string) => void;
  onJoinEvent: () => void;
}) => {
  const categoryColors: Record<EventCategory, string> = {
    PLAYDATE: "bg-blue-500",
    TRAINING: "bg-green-500",
    DOG_PARK: "bg-amber-500",
    COMPETITION: "bg-purple-500",
    ADOPTION: "bg-red-500",
    OTHER: "bg-gray-500",
  };

  const matchPercentage = Math.min(Math.round(score / 100 * 100), 100);

  return (
    <Card className="overflow-hidden">
      <div className="h-2 w-full bg-muted">
        <div 
          className="h-full bg-green-500" 
          style={{ width: `${matchPercentage}%` }}
          title={`${matchPercentage}% match`}
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge className={`${categoryColors[event.category]} text-white`}>
            {event.category.replace("_", " ")}
          </Badge>
          <Badge variant="outline">{matchPercentage}% Match</Badge>
        </div>
        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="line-clamp-1">{event.location}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(new Date(event.date), "PPP")} at {event.time || "TBD"}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <Users className="h-3.5 w-3.5" />
            <span>{event.attendeeCount || 0} attending</span>
          </div>
          {matchReasons.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Why we recommend this:</p>
              <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                {matchReasons.slice(0, 2).map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onViewEvent(event.id)}>
          View Details
        </Button>
        <Button size="sm" className="flex-1" onClick={onJoinEvent}>
          Join
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DogEventRecommendations; 