import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Event, DogProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EventDetailsProps {
  event: Event;
  userDogs: DogProfile[];
  onJoinEvent: (eventId: string, dogId: string) => Promise<void>;
}

export function EventDetails({ event, userDogs, onJoinEvent }: EventDetailsProps) {
  const [selectedDogId, setSelectedDogId] = useState<string>("");
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  
  // Format date
  const formattedDate = event.date instanceof Date 
    ? format(event.date, "MMMM d, yyyy") 
    : format(new Date(event.date), "MMMM d, yyyy");
  
  const handleJoinEvent = async () => {
    if (!selectedDogId) {
      toast.error("Please select a dog to join the event.");
      return;
    }
    
    try {
      await onJoinEvent(event.id, selectedDogId);
      toast.success("Successfully joined the event!");
      setJoinDialogOpen(false);
    } catch (error) {
      toast.error("Failed to join the event. Please try again later.");
      console.error(error);
    }
  };
  
  const checkDogMeetsRequirements = (dog: DogProfile) => {
    if (!event.requirements) return true;
    
    const { minAge, maxAge, dogSize, energyLevel, trainingLevel, breeds } = event.requirements;
    
    if (minAge && dog.age < minAge) return false;
    if (maxAge && dog.age > maxAge) return false;
    
    if (dogSize && dogSize !== 'any') {
      if (Array.isArray(dogSize) && !dogSize.includes(dog.size)) return false;
      if (!Array.isArray(dogSize) && dogSize !== dog.size) return false;
    }
    
    if (energyLevel && energyLevel !== 'any') {
      if (Array.isArray(energyLevel) && !energyLevel.includes(dog.energyLevel)) return false;
      if (!Array.isArray(energyLevel) && energyLevel !== dog.energyLevel) return false;
    }
    
    if (trainingLevel && trainingLevel !== 'any') {
      if (Array.isArray(trainingLevel) && !trainingLevel.includes(dog.trainingLevel)) return false;
      if (!Array.isArray(trainingLevel) && trainingLevel !== dog.trainingLevel) return false;
    }
    
    if (breeds && breeds.length > 0 && !breeds.includes(dog.breed)) return false;
    
    return true;
  };
  
  const eligibleDogs = userDogs.filter(checkDogMeetsRequirements);
  
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              {formattedDate} {event.time && `• ${event.time}`}
            </CardDescription>
          </div>
          <Badge variant="secondary">{event.category}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Event Description */}
        <div>
          <h3 className="font-semibold mb-2">About this event</h3>
          <p>{event.description}</p>
        </div>
        
        <Separator />
        
        {/* Location */}
        <div>
          <h3 className="font-semibold mb-2">Location</h3>
          <p>{event.location}</p>
        </div>
        
        <Separator />
        
        {/* Requirements */}
        {event.requirements && (
          <>
            <div>
              <h3 className="font-semibold mb-2">Requirements</h3>
              <ul className="list-disc pl-5 space-y-1">
                {event.requirements.minAge && (
                  <li>Min age: {event.requirements.minAge} years</li>
                )}
                {event.requirements.maxAge && (
                  <li>Max age: {event.requirements.maxAge} years</li>
                )}
                {event.requirements.dogSize && (
                  <li>Size: {Array.isArray(event.requirements.dogSize) 
                    ? event.requirements.dogSize.join(", ") 
                    : event.requirements.dogSize}
                  </li>
                )}
                {event.requirements.energyLevel && (
                  <li>Energy level: {Array.isArray(event.requirements.energyLevel) 
                    ? event.requirements.energyLevel.join(", ") 
                    : event.requirements.energyLevel}
                  </li>
                )}
                {event.requirements.trainingLevel && (
                  <li>Training level: {Array.isArray(event.requirements.trainingLevel) 
                    ? event.requirements.trainingLevel.join(", ") 
                    : event.requirements.trainingLevel}
                  </li>
                )}
                {event.requirements.breeds && event.requirements.breeds.length > 0 && (
                  <li>Breeds: {event.requirements.breeds.join(", ")}</li>
                )}
              </ul>
            </div>
            <Separator />
          </>
        )}
        
        {/* Host */}
        {event.host && (
          <>
            <div>
              <h3 className="font-semibold mb-2">Event Host</h3>
              <div className="flex items-center gap-3">
                <Avatar>
                  {event.host.profileImage && (
                    <AvatarImage src={event.host.profileImage} alt={event.host.name} />
                  )}
                  <AvatarFallback>{event.host.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{event.host.name}</p>
                  {event.host.bio && <p className="text-sm text-muted-foreground">{event.host.bio}</p>}
                </div>
              </div>
            </div>
            <Separator />
          </>
        )}
        
        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <p className="text-muted-foreground">
          {event.attendeeCount || 0} {event.attendeeCount === 1 ? 'attendee' : 'attendees'}
        </p>
        <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
          <DialogTrigger asChild>
            <Button>Join Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join {event.title}</DialogTitle>
              <DialogDescription>
                Select which dog you'd like to bring to this event.
              </DialogDescription>
            </DialogHeader>
            
            {eligibleDogs.length === 0 ? (
              <div className="my-4 text-center">
                <p className="text-red-500">None of your dogs meet the requirements for this event.</p>
              </div>
            ) : (
              <ScrollArea className="max-h-[250px] my-4">
                <Select value={selectedDogId} onValueChange={setSelectedDogId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a dog" />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleDogs.map((dog) => (
                      <SelectItem key={dog.id} value={dog.id}>
                        {dog.name} ({dog.breed})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </ScrollArea>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setJoinDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleJoinEvent} 
                disabled={!selectedDogId || eligibleDogs.length === 0}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
} 