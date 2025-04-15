import { useState } from "react";
import { Event, EventComment } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ChevronLeft,
} from "lucide-react";

import EventCommentForm from "./EventCommentForm";
import EventReactions, { defaultReactions } from "./EventReactions";
import EventSocialShare from "./EventSocialShare";

interface EventDetailsViewProps {
  event: Event;
  onBack: () => void;
  onJoin: (eventId: string) => void;
}

const EventDetailsView = ({
  event,
  onBack,
  onJoin,
}: EventDetailsViewProps) => {
  const isFull = event.status === "Full";
  const spotsLeft = event.maxAttendees - event.attendees.length;
  
  // Mock user data - replace with actual user data
  const currentUser = {
    id: "current-user",
    name: "John Doe",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
  };

  const [comments, setComments] = useState<EventComment[]>(event.comments);
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [reactions, setReactions] = useState(defaultReactions);

  const handleComment = (content: string) => {
    const newComment: EventComment = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      userName: currentUser.name,
      userImageUrl: currentUser.imageUrl,
      content,
      createdAt: "Just now",
    };
    setComments([newComment, ...comments]);
  };

  const handleReaction = (reactionId: string) => {
    setUserReactions((prev) => {
      const isReacted = prev.includes(reactionId);
      if (isReacted) {
        return prev.filter((id) => id !== reactionId);
      }
      return [...prev, reactionId];
    });

    setReactions((prev) =>
      prev.map((reaction) =>
        reaction.id === reactionId
          ? {
              ...reaction,
              count: userReactions.includes(reactionId)
                ? reaction.count - 1
                : reaction.count + 1,
            }
          : reaction
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{event.title}</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image */}
          <div className="aspect-video rounded-lg overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Reactions */}
          <div className="flex items-center justify-between">
            <EventReactions
              reactions={reactions}
              onReact={handleReaction}
              userReactions={userReactions}
            />
            <EventSocialShare
              event={event}
              shareUrl={window.location.href}
            />
          </div>

          {/* Event Details Tabs */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="attendees">Attendees</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <div className="prose dark:prose-invert">
                <p className="text-muted-foreground">{event.description}</p>
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>2 hours (estimated)</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location.address}</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{spotsLeft} spots remaining</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attendees" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={event.host.imageUrl}
                      alt={event.host.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{event.host.name}</p>
                    <p className="text-sm text-muted-foreground">Host</p>
                  </div>
                </div>

                <Separator />

                <h3 className="font-medium">Attendees ({event.attendees.length})</h3>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {event.attendees.map((attendee) => (
                      <div key={attendee.id} className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img
                            src={attendee.imageUrl}
                            alt={attendee.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{attendee.name}</p>
                          <p className="text-sm text-muted-foreground">
                            with {attendee.dogName}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="discussion" className="mt-6">
              <div className="space-y-6">
                <EventCommentForm
                  userImageUrl={currentUser.imageUrl}
                  userName={currentUser.name}
                  onSubmit={handleComment}
                />
                
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {comments.map((comment: EventComment) => (
                      <div key={comment.id} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            src={comment.userImageUrl}
                            alt={comment.userName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{comment.userName}</p>
                            <span className="text-sm text-muted-foreground">
                              {comment.createdAt}
                            </span>
                          </div>
                          <p className="text-muted-foreground mt-1">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="bg-card rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <Badge variant="secondary" className="text-base px-4 py-1">
                {event.category}
              </Badge>
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={isFull}
              onClick={() => onJoin(event.id)}
            >
              {isFull ? "Event Full" : "Join Event"}
            </Button>
          </div>

          {/* Location Map */}
          <div className="bg-card rounded-lg p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </h3>
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <iframe
                title="Event Location"
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${event.location.coordinates.lng-0.01},${event.location.coordinates.lat-0.01},${event.location.coordinates.lng+0.01},${event.location.coordinates.lat+0.01}&layer=mapnik&marker=${event.location.coordinates.lat},${event.location.coordinates.lng}`}
              />
            </div>
            <p className="text-sm text-muted-foreground">{event.location.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsView;