import { Event, DogProfile, EventAttendee, EventHost, User } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { format, differenceInCalendarDays } from "date-fns";
import { ExternalLink, Activity, MapPin, Calendar } from "lucide-react";
import { GroupWalkCard } from "@/components/dashboard/GroupWalkCard";
import DogProfileCard from "@/components/dashboard/DogProfileCard";

// Mock User for filtering joined events
const mockUser: User = {
  id: "user123",
  name: "Current User",
  email: "user@example.com",
  createdAt: new Date().toISOString(),
};

// Mock data for events and dogs - Updated to match types
const mockAttendees: EventAttendee[] = [
  { id: "user123", name: "Current User", imageUrl: "https://randomuser.me/api/portraits/lego/1.jpg", dogName: "Max" },
  { id: "u1", name: "Alex Johnson", imageUrl: "https://randomuser.me/api/portraits/women/12.jpg", dogName: "Buddy" },
  { id: "u2", name: "Sarah Miller", imageUrl: "https://randomuser.me/api/portraits/women/23.jpg", dogName: "Lucy" },
  { id: "u4", name: "Jane Thompson", imageUrl: "https://randomuser.me/api/portraits/women/45.jpg", dogName: "Charlie" },
];

const mockHost: EventHost = {
  id: "h1",
  name: "Community Walks Org",
  imageUrl: "https://randomuser.me/api/portraits/men/50.jpg"
};

const today = new Date();
const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
const twoDays = new Date(today); twoDays.setDate(today.getDate() + 2);
const fiveDays = new Date(today); fiveDays.setDate(today.getDate() + 5);

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Morning Park Walk",
    description: "Join us for a refreshing morning walk in Central Park with our furry friends.",
    shortDescription: "Morning group walk at the park",
    date: twoDays.toISOString().split('T')[0], // Format as YYYY-MM-DD string
    time: "07:30 AM",
    location: { name: "Central Park", address: "New York, NY", coordinates: { lat: 40.78, lng: -73.96 } },
    imageUrl: "https://images.unsplash.com/photo-1594586019639-bed9cfd363a5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Walk", // Changed from "Group Walk"
    tags: ["morning", "park", "easy"],
    maxAttendees: 20,
    attendees: mockAttendees.slice(0, 2), // User is attending
    host: mockHost,
    status: "Open", // Changed from "upcoming"
    gallery: [],
    comments: [],
    createdAt: today.toISOString(),
    updatedAt: today.toISOString(),
    difficultyLevel: "Easy",
  },
  {
    id: "2",
    title: "Beach Day with Dogs",
    description: "Bring your dogs to the beach for a fun day of sun, sand, and surf!",
    shortDescription: "Fun day at the beach with dogs",
    date: fiveDays.toISOString().split('T')[0],
    time: "10:00 AM",
    location: { name: "Dog Beach", address: "San Diego, CA", coordinates: { lat: 32.75, lng: -117.25 } },
    imageUrl: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Social",
    tags: ["beach", "social", "fun"],
    maxAttendees: 30,
    attendees: mockAttendees.slice(0, 3), // User is attending
    host: mockHost,
    status: "Open",
    gallery: [],
    comments: [],
    createdAt: today.toISOString(),
    updatedAt: today.toISOString(),
    difficultyLevel: "Moderate",
  },
  {
    id: "3",
    title: "Agility Training Workshop",
    description: "Learn basic agility training techniques with certified trainers.",
    shortDescription: "Basic agility training workshop",
    date: tomorrow.toISOString().split('T')[0],
    time: "3:00 PM",
    location: { name: "Paws Training Center", address: "123 Training Rd", coordinates: { lat: 34.05, lng: -118.24 } },
    imageUrl: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Training",
    tags: ["agility", "training", "workshop"],
    maxAttendees: 10,
    attendees: [], // User is NOT attending
    host: { id: "h2", name: "Pro Trainers", imageUrl: "https://randomuser.me/api/portraits/men/55.jpg" },
    status: "Open",
    gallery: [],
    comments: [],
    createdAt: today.toISOString(),
    updatedAt: today.toISOString(),
    difficultyLevel: "Moderate",
  },
  {
    id: "4",
    title: "Evening Park Meetup",
    description: "Casual evening meetup at the local dog park.",
    shortDescription: "Evening meetup at the dog park",
    date: today.toISOString().split('T')[0], // Today
    time: "6:00 PM",
    location: { name: "Riverside Dog Park", address: "Riverside Dr", coordinates: { lat: 40.82, lng: -73.95 } },
    imageUrl: "https://images.unsplash.com/photo-1610041518889-c7c02c101d94?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Social",
    tags: ["evening", "park", "social"],
    maxAttendees: 25,
    attendees: mockAttendees.slice(0, 4), // User is attending
    host: mockHost,
    status: "Open",
    gallery: [],
    comments: [],
    createdAt: today.toISOString(),
    updatedAt: today.toISOString(),
    difficultyLevel: "Easy",
  }
];

const mockDogs: DogProfile[] = [
  {
    id: "d1",
    name: "Max",
    breed: "German Shepherd",
    age: 3,
    energy: "High",
    isGoodOffLeash: true,
    imageUrl: "https://images.unsplash.com/photo-1605883705077-4347b86270ad?w=300&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
    stats: {
      totalActivities: 84,
      totalDistance: 156.2,
      avgDuration: 45,
      streak: 4
    },
    activities: [], // Added missing property
    joinedEvents: ["1", "2", "4"] // Added missing property
  },
  {
    id: "d2",
    name: "Bella",
    breed: "Labrador Retriever",
    age: 2,
    energy: "Medium",
    isGoodOffLeash: true,
    imageUrl: "https://images.unsplash.com/photo-1537204696486-967f1b7198c8?w=300&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
    stats: {
      totalActivities: 65,
      totalDistance: 110.5,
      avgDuration: 40,
      streak: 3
    },
    activities: [], // Added missing property
    joinedEvents: ["1"] // Added missing property
  }
];

const Overview = () => {
  // Filter for events the user has joined (check attendees list)
  const joinedEvents = mockEvents.filter(event => 
    event.attendees.some(attendee => attendee.id === mockUser.id)
  );
  
  // Function to calculate days until event (using date string)
  const calculateDaysUntil = (eventDateStr: string): number => {
    const eventDate = new Date(eventDateStr);
    const currentDate = new Date();
    // Set hours to 0 to compare dates only, not time
    currentDate.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0); // Also adjust event date if it includes time
    
    return differenceInCalendarDays(eventDate, currentDate);
  };
  
  // Filter and sort upcoming joined events
  const upcomingJoinedEvents = joinedEvents
    .map(event => ({
      ...event,
      // Ensure date is parsed correctly for sorting and filtering
      parsedDate: new Date(event.date + 'T' + event.time.replace(' ', '')) // Combine date and time for accurate comparison
    }))
    .filter(event => event.parsedDate >= new Date()) // Filter out past events
    .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime()); // Sort by date

  // Get the very next event
  const nextEvent = upcomingJoinedEvents.length > 0 ? upcomingJoinedEvents[0] : null;
  const daysUntilNextEvent = nextEvent ? calculateDaysUntil(nextEvent.date) : undefined;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" className="space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Calendar</span>
        </Button>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="myEvents">My Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Upcoming Group Walks Card - Updated props */}
            <div className="md:col-span-2">
              <GroupWalkCard nextEvent={nextEvent} daysUntil={daysUntilNextEvent} />
            </div>
            
            {/* Dog Profile Card */}
            <div>
              <DogProfileCard dogs={mockDogs} />
            </div>
          </div>
          
          {/* Activity Overview - Commented out */}
          {/* <ActivityOverview /> */}
          
          {/* Recent Walks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Evening Park Walk</h3>
                      <p className="text-sm text-muted-foreground">30 minutes • 2.1 km</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Today, 6:30 PM</p>
                </div>
                
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Morning Run</h3>
                      <p className="text-sm text-muted-foreground">45 minutes • 3.5 km</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Yesterday, 7:15 AM</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Neighborhood Stroll</h3>
                      <p className="text-sm text-muted-foreground">20 minutes • 1.2 km</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">2 days ago, 5:45 PM</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                View All Activities
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="myEvents" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">My Events</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Use upcomingJoinedEvents here to only show future events user joined */}
            {upcomingJoinedEvents.map(event => (
              <Card key={event.id} className="overflow-hidden">
                <div className="h-40 w-full overflow-hidden">
                  <img 
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {event.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{event.shortDescription}</p>
                  <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {/* Format the string date */}
                    <span>{format(new Date(event.date + 'T00:00:00'), 'MMM d, yyyy')} • {event.time}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {/* Render location name */}
                    <span>{event.location.name}</span> 
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <div className="text-sm text-muted-foreground">
                     {/* Render attendee count */}
                    {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
                  </div>
                  <Button variant="outline" size="sm">Details</Button>
                </CardFooter>
              </Card>
            ))}
            {upcomingJoinedEvents.length === 0 && (
               <p className="text-muted-foreground col-span-full text-center py-4">You haven't joined any upcoming events yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Overview;