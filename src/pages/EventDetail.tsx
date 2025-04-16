import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvents } from "@/domains/events/hooks/useEvents";
import { useDogs } from "@/domains/dogs/hooks/useDogs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import EventDetailsView from "@/components/events/EventDetailsView";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { getEvent, joinEvent: handleJoinEventService } = useEvents();
  const { dogs } = useDogs();
  
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Join event dialog state
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [selectedDogToJoin, setSelectedDogToJoin] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setError("Event ID is missing");
      setIsLoading(false);
      return;
    }

    try {
      const eventData = getEvent(eventId);
      if (!eventData) {
        setError("Event not found");
      } else {
        setEvent(eventData);
      }
    } catch (error) {
      setError("Failed to load event details");
      console.error("Error loading event:", error);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, getEvent]);

  const handleBack = () => {
    navigate("/events");
  };

  const handleJoinEvent = () => {
    setIsJoinDialogOpen(true);
  };

  const handleConfirmJoin = () => {
    if (!event || !selectedDogToJoin) return;

    const selectedDogProfile = dogs.find(d => d.id === selectedDogToJoin);
    if (!selectedDogProfile) return;

    // Create attendee from selected dog
    const newAttendee = {
      id: selectedDogProfile.id,
      name: selectedDogProfile.name,
      avatar: selectedDogProfile.avatar || selectedDogProfile.imageUrl || "",
      dogName: selectedDogProfile.name,
      joinedAt: new Date().toISOString(),
    };
    
    // Join the event using our domain service
    handleJoinEventService(event.id, newAttendee);
    
    // Close dialog
    setIsJoinDialogOpen(false);
    setSelectedDogToJoin(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto py-10">
        <Button onClick={handleBack} variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
        <div className="p-6 bg-destructive/10 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
          <p>{error || "Event not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Button onClick={handleBack} variant="ghost" className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Button>
      
      <div className="bg-card border rounded-lg shadow-sm">
        <EventDetailsView
          event={event}
          onBack={handleBack}
          onJoin={handleJoinEvent}
        />
      </div>
      
      {/* Join event dialog */}
      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Join Event</DialogTitle>
          </DialogHeader>
          <div className="my-6 space-y-4">
            {event && (
              <>
                <h3 className="font-semibold mb-2">{event.title}</h3>
                <p>Select a dog to join with:</p>
                <div className="grid gap-4 py-4">
                  <ScrollArea className="h-72">
                    <div className="space-y-4">
                      {dogs.map((dog) => {
                        // Check if dog is already attending
                        const isAttending = event.attendees.some(
                          (a) => a.id === dog.id
                        );
                        
                        return (
                          <div
                            key={dog.id}
                            className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedDogToJoin === dog.id
                                ? "border-primary bg-primary/10"
                                : "hover:border-primary/50"
                            } ${isAttending ? "opacity-50" : ""}`}
                            onClick={() => {
                              if (!isAttending) {
                                setSelectedDogToJoin(dog.id);
                              }
                            }}
                          >
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                              <img
                                src={dog.avatar || dog.imageUrl}
                                alt={dog.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{dog.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {dog.breed}, {dog.age} years
                              </p>
                            </div>
                            {isAttending ? (
                              <Badge variant="outline" className="ml-auto">
                                <Check className="h-3 w-3 mr-1" />
                                Joined
                              </Badge>
                            ) : selectedDogToJoin === dog.id ? (
                              <div className="h-4 w-4 rounded-full bg-primary"></div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsJoinDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmJoin}
              disabled={!selectedDogToJoin}
            >
              Join Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventDetail; 