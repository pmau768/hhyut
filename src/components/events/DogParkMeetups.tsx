import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format, addDays, parse } from "date-fns";
import { MapPin, Calendar, Clock, Users, ArrowRight, Plus, Search } from "lucide-react";
import { DogProfile } from "@/lib/types";
import { EventFormData } from "@/domains/events/types";

interface DogParkMeetupsProps {
  userDogs: DogProfile[];
  userLocation?: { lat: number; lng: number } | null;
  onCreateMeetup: (meetupData: EventFormData, imageFile: File | null) => void;
  onJoinMeetup: (meetupId: string, dogId: string) => void;
}

// Mock data for dog parks
const mockDogParks = [
  {
    id: "park1",
    name: "Central Park Dog Run",
    address: "Central Park, New York, NY",
    coordinates: { lat: 40.7812, lng: -73.9665 },
    description: "Large off-leash area with separate sections for small and large dogs.",
    amenities: ["Water stations", "Seating", "Shade", "Waste stations"],
    rating: 4.5,
    reviewCount: 128,
    images: ["https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=800"],
    distance: 0.8, // miles
    isOffLeash: true,
    features: ["Fenced", "Water access", "Small dog area"],
    popularTimes: {
      weekdays: ["7-9am", "5-7pm"],
      weekends: ["9-11am", "3-5pm"]
    }
  },
  {
    id: "park2",
    name: "Riverside Dog Park",
    address: "Riverside Park, New York, NY",
    coordinates: { lat: 40.8025, lng: -73.9718 },
    description: "Scenic dog run with river views and plenty of space to play.",
    amenities: ["Water stations", "Benches", "Waste stations"],
    rating: 4.2,
    reviewCount: 96,
    images: ["https://images.unsplash.com/photo-1586821678643-9b15bfec9b14?auto=format&fit=crop&q=80&w=800"],
    distance: 1.2, // miles
    isOffLeash: true,
    features: ["Fenced", "Views"],
    popularTimes: {
      weekdays: ["6-8am", "6-8pm"],
      weekends: ["10am-1pm", "4-6pm"]
    }
  },
  {
    id: "park3",
    name: "Hudson River Dog Park",
    address: "Hudson River Park, New York, NY",
    coordinates: { lat: 40.7484, lng: -74.0084 },
    description: "Waterfront dog park with spectacular views and large play area.",
    amenities: ["Water stations", "Shade structures", "Waste stations", "Seating"],
    rating: 4.7,
    reviewCount: 152,
    images: ["https://images.unsplash.com/photo-1594003530908-5d100b23b2ed?auto=format&fit=crop&q=80&w=800"],
    distance: 1.5, // miles
    isOffLeash: true,
    features: ["Fenced", "Water access", "Double gates"],
    popularTimes: {
      weekdays: ["7-9am", "5-7pm"],
      weekends: ["8-11am", "3-6pm"]
    }
  }
];

// Mock meetups data
const mockMeetups = [
  {
    id: "meetup1",
    title: "Morning Play Session",
    description: "Join us for a fun morning play session with our dogs! All friendly dogs welcome.",
    parkId: "park1",
    parkName: "Central Park Dog Run",
    date: format(addDays(new Date(), 2), "yyyy-MM-dd"),
    time: "9:00 AM",
    duration: 60, // minutes
    host: {
      id: "user1",
      name: "Emma Wilson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
    },
    attendees: [
      {
        userId: "user1",
        userName: "Emma Wilson",
        userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
        dogName: "Max",
        dogAvatar: "https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?auto=format&fit=crop&q=80&w=200",
      }
    ],
    maxAttendees: 10,
    dogSizePreference: "Any",
    isRecurring: false,
    tags: ["morning", "social", "play"]
  },
  {
    id: "meetup2",
    title: "Weekend Small Dogs Gathering",
    description: "A meetup specifically for small dogs under 20 pounds. Great opportunity for socialization in a safe environment.",
    parkId: "park2",
    parkName: "Riverside Dog Park",
    date: format(addDays(new Date(), 3), "yyyy-MM-dd"),
    time: "10:30 AM",
    duration: 90, // minutes
    host: {
      id: "user2",
      name: "John Davis",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
    },
    attendees: [
      {
        userId: "user2",
        userName: "John Davis",
        userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
        dogName: "Bella",
        dogAvatar: "https://images.unsplash.com/photo-1605897472359-3d5ab59efa41?auto=format&fit=crop&q=80&w=200",
      },
      {
        userId: "user3",
        userName: "Sarah Miller",
        userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
        dogName: "Daisy",
        dogAvatar: "https://images.unsplash.com/photo-1583511655826-05700a463f78?auto=format&fit=crop&q=80&w=200",
      }
    ],
    maxAttendees: 8,
    dogSizePreference: "Small",
    isRecurring: true,
    recurringPattern: "Weekly",
    tags: ["small-dogs", "weekend", "social"]
  },
  {
    id: "meetup3",
    title: "Evening Exercise Group",
    description: "After-work dog exercise group. We do a combination of play and structured walking.",
    parkId: "park3",
    parkName: "Hudson River Dog Park",
    date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    time: "6:00 PM",
    duration: 60, // minutes
    host: {
      id: "user4",
      name: "Michael Johnson",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200"
    },
    attendees: [
      {
        userId: "user4",
        userName: "Michael Johnson",
        userAvatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200",
        dogName: "Rocky",
        dogAvatar: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=200",
      }
    ],
    maxAttendees: 12,
    dogSizePreference: "Any",
    isRecurring: true,
    recurringPattern: "Weekdays",
    tags: ["evening", "exercise", "weekday"]
  }
];

const DogParkMeetups: React.FC<DogParkMeetupsProps> = ({ userDogs, userLocation, onCreateMeetup, onJoinMeetup }) => {
  const [activeTab, setActiveTab] = useState("meetups");
  const [selectedParkId, setSelectedParkId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(userDogs.length > 0 ? userDogs[0].id : null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const selectedPark = selectedParkId 
    ? mockDogParks.find(park => park.id === selectedParkId) 
    : null;
    
  const filteredParks = mockDogParks
    .filter(park => {
      if (!searchQuery) return true;
      return park.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        park.address.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => a.distance - b.distance);
  
  const filteredMeetups = mockMeetups
    .filter(meetup => {
      if (!searchQuery) return true;
      return meetup.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meetup.parkName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meetup.description.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      // Sort by date (ascending)
      return new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime();
    });
  
  const [newMeetupData, setNewMeetupData] = useState({
    title: "",
    description: "",
    parkId: "",
    date: "",
    time: "",
    duration: 60,
    dogId: selectedDogId,
    maxAttendees: 8,
    dogSizePreference: "Any",
    isRecurring: false
  });
  
  const handleCreateMeetup = () => {
    // Find the selected park
    const park = mockDogParks.find(p => p.id === selectedParkId);
    if (!park) return;
    
    // Find the selected dog
    const dog = userDogs.find(d => d.id === newMeetupData.dogId);
    if (!dog) return;
    
    // Format data for event creation
    const eventData: EventFormData = {
      title: newMeetupData.title,
      shortDescription: `Dog park meetup at ${park.name}`,
      description: newMeetupData.description,
      date: format(parse(newMeetupData.date, 'yyyy-MM-dd', new Date()), 'MMM dd, yyyy'),
      time: newMeetupData.time,
      location: {
        name: park.name,
        address: park.address,
        coordinates: park.coordinates
      },
      category: "Social",
      avatar: park.images[0],
      difficultyLevel: "Easy",
      requiredAbilities: [],
      suitableEnergyLevels: ["Low", "Medium", "High"],
      suitableDogSizes: [newMeetupData.dogSizePreference === "Any" ? "Any" : 
                        newMeetupData.dogSizePreference === "Small" ? "Small" : 
                        newMeetupData.dogSizePreference === "Medium" ? "Medium" : "Large"],
      minAge: 0,
      maxAttendees: newMeetupData.maxAttendees,
      tags: ["dogpark", "meetup", "social"],
      host: {
        id: "current-user",
        name: "Your Name",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
      },
      duration: newMeetupData.duration,
      breedRecommendations: [],
      notRecommendedFor: []
    };
    
    // Create the event through the parent component
    onCreateMeetup(eventData, null);
    
    // Close the dialog and reset form
    setIsCreateDialogOpen(false);
    setNewMeetupData({
      title: "",
      description: "",
      parkId: "",
      date: "",
      time: "",
      duration: 60,
      dogId: selectedDogId,
      maxAttendees: 8,
      dogSizePreference: "Any",
      isRecurring: false
    });
  };
  
  // Update parkId when selectedParkId changes
  useEffect(() => {
    if (selectedParkId) {
      setNewMeetupData(prev => ({ ...prev, parkId: selectedParkId }));
    }
  }, [selectedParkId]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Dog Park Meetups</h2>
          <p className="text-muted-foreground">
            Find local dog parks and join meetups with other dog owners
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search parks or meetups..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Meetup
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="meetups" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="meetups">Upcoming Meetups</TabsTrigger>
          <TabsTrigger value="parks">Dog Parks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="meetups" className="mt-6">
          {filteredMeetups.length === 0 ? (
            <Card className="border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">No meetups found</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No upcoming meetups match your search criteria. Try adjusting your search or create a new meetup.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create a Meetup
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMeetups.map(meetup => (
                <Card key={meetup.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-base">{meetup.title}</CardTitle>
                        <CardDescription>
                          {meetup.parkName}
                        </CardDescription>
                      </div>
                      {meetup.isRecurring && (
                        <Badge variant="outline" className="text-xs">
                          {meetup.recurringPattern}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {meetup.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{format(new Date(meetup.date), "EEEE, MMMM d, yyyy")}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{meetup.time} ({meetup.duration} min)</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{meetup.parkName}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{meetup.attendees.length}/{meetup.maxAttendees} attending</span>
                      </div>
                    </div>
                    
                    <div className="pt-1">
                      <p className="text-sm font-medium mb-1">Attendees:</p>
                      <div className="flex -space-x-2 overflow-hidden">
                        {meetup.attendees.map((attendee, i) => (
                          <Avatar key={i} className="h-8 w-8 border-2 border-background">
                            <AvatarImage src={attendee.dogAvatar} alt={attendee.dogName} />
                            <AvatarFallback>{attendee.dogName[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                        {meetup.attendees.length < meetup.maxAttendees && (
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                            <Plus className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        if (selectedDogId) {
                          onJoinMeetup(meetup.id, selectedDogId);
                        }
                      }}
                      disabled={!selectedDogId || meetup.attendees.length >= meetup.maxAttendees}
                    >
                      Join Meetup
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-xs"
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="parks" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredParks.map(park => (
              <Card key={park.id} className="overflow-hidden">
                <div 
                  className="w-full h-32 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${park.images[0]})` }}
                />
                
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center">
                        {park.name}
                        {park.isOffLeash && (
                          <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100 text-xs">Off-leash</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {park.address}
                      </CardDescription>
                    </div>
                    <div className="text-sm font-medium">
                      {park.distance} mi
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {park.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {park.features.map((feature, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <p className="font-medium">Popular times:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs text-muted-foreground">Weekdays:</span>
                        <p className="text-xs">{park.popularTimes.weekdays.join(', ')}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Weekends:</span>
                        <p className="text-xs">{park.popularTimes.weekends.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between pt-2 border-t">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setSelectedParkId(park.id);
                      setIsCreateDialogOpen(true);
                    }}
                  >
                    Create Meetup
                  </Button>
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="text-xs flex items-center"
                  >
                    View Details
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Create Meetup Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create a Dog Park Meetup</DialogTitle>
            <DialogDescription>
              Schedule a meetup at {selectedPark?.name || "a local dog park"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Meetup Title</Label>
              <Input
                id="title"
                placeholder="Morning Play Date"
                value={newMeetupData.title}
                onChange={(e) => setNewMeetupData({...newMeetupData, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell others what to expect at this meetup..."
                value={newMeetupData.description}
                onChange={(e) => setNewMeetupData({...newMeetupData, description: e.target.value})}
                className="h-20"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newMeetupData.date}
                  onChange={(e) => setNewMeetupData({...newMeetupData, date: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newMeetupData.time}
                  onChange={(e) => setNewMeetupData({...newMeetupData, time: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dog">Your Dog</Label>
              <div className="grid grid-cols-2 gap-2">
                {userDogs.map(dog => (
                  <Button
                    key={dog.id}
                    type="button"
                    variant={newMeetupData.dogId === dog.id ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setNewMeetupData({...newMeetupData, dogId: dog.id})}
                  >
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={dog.avatar} />
                      <AvatarFallback>{dog.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {dog.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleCreateMeetup}
              disabled={!newMeetupData.title || !newMeetupData.date || !newMeetupData.time || !newMeetupData.dogId}
            >
              Create Meetup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DogParkMeetups; 