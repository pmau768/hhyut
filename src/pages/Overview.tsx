import { DogProfile, EventAttendee, EventCategory, EventStatus, EventComment, DifficultyLevel } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { ExternalLink, Activity, MapPin, Calendar, BarChart3, TrendingUp, Timer, Navigation, Plus, Cloud, CloudRain, Sun, Wind, Flame } from "lucide-react";
import { GroupWalkCard } from "@/components/dashboard/GroupWalkCard";
import DogProfileCard from "@/components/dashboard/DogProfileCard";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

interface StreakActivity {
  date: string;
  completed: boolean;
}

interface DogEvent {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  avatar: string;
  imageUrl?: string; // Alias for backward compatibility
  category: EventCategory;
  date: string;
  time: string;
  distance: number;
  difficultyLevel: DifficultyLevel;
  tags: string[];
  maxAttendees: number;
  attendees: EventAttendee[];
  host: EventAttendee;
  status: EventStatus;
  gallery: string[];
  comments: EventComment[];
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

// Add interfaces at the top of the file
interface WeeklySummary {
  totalWalks: number;
  totalDistance: number;
  totalMinutes: number;
  walksCompletion: number;
  distanceCompletion: number;
  minutesCompletion: number;
}

interface WeeklyGoals {
  walks: number;
  distance: number;
  minutes: number;
}

interface WeatherData {
  condition: 'rainy' | 'sunny' | 'cloudy' | 'windy' | 'partly-cloudy';
  temperature: number;
  icon: string;
}

// Mock data for events and dogs - Updated to match types
const mockAttendees: EventAttendee[] = [
  { id: "1", name: "Alice Smith", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
  { id: "2", name: "Bob Johnson", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: "3", name: "Carol White", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
  { id: "4", name: "David Brown", avatar: "https://randomuser.me/api/portraits/men/2.jpg" }
];

const mockHost: EventAttendee = {
  id: "h2",
  name: "Pro Trainers",
  avatar: "https://randomuser.me/api/portraits/men/55.jpg"
};

const today = new Date();
const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
const twoDays = new Date(today); twoDays.setDate(today.getDate() + 2);
const fiveDays = new Date(today); fiveDays.setDate(today.getDate() + 5);

const mockEvents: DogEvent[] = [
  {
    id: "1",
    title: "Morning Park Walk",
    shortDescription: "Join us for a refreshing morning walk",
    description: "Start your day right with fellow dog owners",
    avatar: "",
    imageUrl: "/images/park-walk.jpg",
    category: "Walk",
    date: "2024-03-20",
    time: "08:00",
    distance: 2.5,
    difficultyLevel: "Easy",
    tags: ["morning", "walk", "social"],
    maxAttendees: 10,
    attendees: mockAttendees.slice(0, 2),
    host: mockHost,
    status: "Open",
    gallery: [],
    comments: [],
    location: {
      name: "Central Park",
      address: "123 Park Avenue",
      coordinates: { lat: 40.7829, lng: -73.9654 }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Beach Day with Dogs",
    shortDescription: "Fun day at the beach with dogs",
    description: "Bring your dogs to the beach for a fun day of sun, sand, and surf!",
    avatar: "",
    imageUrl: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Social",
    date: fiveDays.toISOString().split('T')[0],
    time: "10:00 AM",
    distance: 5.2,
    difficultyLevel: "Moderate",
    tags: ["beach", "social", "fun"],
    maxAttendees: 30,
    attendees: mockAttendees.slice(0, 3),
    host: mockHost,
    status: "Open",
    gallery: [],
    comments: [],
    location: {
      name: "Dog Beach",
      address: "San Diego, CA",
      coordinates: { lat: 32.75, lng: -117.25 }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Agility Training Workshop",
    shortDescription: "Basic agility training workshop",
    description: "Learn basic agility training techniques with certified trainers.",
    avatar: "",
    imageUrl: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Training",
    date: tomorrow.toISOString().split('T')[0],
    time: "3:00 PM",
    distance: 3.8,
    difficultyLevel: "Moderate",
    tags: ["agility", "training", "workshop"],
    maxAttendees: 10,
    attendees: [],
    host: mockHost,
    status: "Open",
    gallery: [],
    comments: [],
    location: {
      name: "Paws Training Center",
      address: "123 Training Rd",
      coordinates: { lat: 34.05, lng: -118.24 }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Evening Park Meetup",
    shortDescription: "Evening meetup at the dog park",
    description: "Casual evening meetup at the local dog park.",
    avatar: "",
    imageUrl: "https://images.unsplash.com/photo-1610041518889-c7c02c101d94?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Social",
    date: today.toISOString().split('T')[0],
    time: "6:00 PM",
    distance: 1.5,
    difficultyLevel: "Easy",
    tags: ["evening", "park", "social"],
    maxAttendees: 25,
    attendees: mockAttendees.slice(0, 4),
    host: mockHost,
    status: "Open",
    gallery: [],
    comments: [],
    location: {
      name: "Riverside Dog Park",
      address: "Riverside Dr",
      coordinates: { lat: 40.82, lng: -73.95 }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    avatar: "https://images.unsplash.com/photo-1605883705077-4347b86270ad?w=300&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
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
    avatar: "https://images.unsplash.com/photo-1537204696486-967f1b7198c8?w=300&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
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

const mockNearbyEvents: DogEvent[] = [
  {
    id: "5",
    title: "Evening Training Session",
    shortDescription: "Training session for all skill levels",
    description: "Join us for an evening training session for dogs of all skill levels.",
    avatar: "",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Training",
    date: tomorrow.toISOString().split('T')[0],
    time: "7:00 PM",
    distance: 0.8,
    difficultyLevel: "Easy",
    tags: ["training", "evening", "all-levels"],
    maxAttendees: 15,
    attendees: mockAttendees.slice(2, 3),
    host: mockHost,
    status: "Open",
    gallery: [],
    comments: [],
    location: {
      name: "Central Park Training Area",
      address: "New York, NY",
      coordinates: { lat: 40.78, lng: -73.96 }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "6",
    title: "Weekend Hiking Adventure",
    shortDescription: "Dog-friendly hiking trip through scenic trails",
    description: "Take your dogs on an exciting hiking adventure through scenic trails.",
    avatar: "",
    imageUrl: "https://images.unsplash.com/photo-1515756759274-5c5605364a37?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Other",
    date: fiveDays.toISOString().split('T')[0],
    time: "9:00 AM",
    distance: 15.3,
    difficultyLevel: "Challenging",
    tags: ["hiking", "adventure", "weekend"],
    maxAttendees: 12,
    attendees: [],
    host: mockHost,
    status: "Open",
    gallery: [],
    comments: [],
    location: {
      name: "Bear Mountain",
      address: "Bear Mountain, NY",
      coordinates: { lat: 41.31, lng: -73.98 }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "7",
    title: "Puppy Socialization Meetup",
    description: "Special meetup for puppies to play and socialize in a safe environment.",
    shortDescription: "Puppy socialization and playtime",
    date: tomorrow.toISOString().split('T')[0],
    time: "10:00 AM",
    location: { name: "Dogwood Park", address: "Brooklyn, NY", coordinates: { lat: 40.68, lng: -73.94 } },
    avatar: "",
    imageUrl: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Social",
    tags: ["puppies", "social", "playtime"],
    maxAttendees: 10,
    attendees: mockAttendees.slice(0, 1),
    host: mockHost,
    status: "Open",
    gallery: [],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    difficultyLevel: "Easy",
    distance: 4.5, // km away
  }
];

// Mock weather data (in a real app, this would come from a weather API)
const mockWeatherData: WeatherData = {
  condition: 'sunny',
  temperature: 22,
  icon: 'sun',
};

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case "sunny":
      return <Sun className="h-8 w-8 text-amber-500" />;
    case "partly-cloudy":
      return <Cloud className="h-8 w-8 text-blue-400" />;
    case "cloudy":
      return <Cloud className="h-8 w-8 text-gray-400" />;
    case "rainy":
      return <CloudRain className="h-8 w-8 text-blue-600" />;
    case "windy":
      return <Wind className="h-8 w-8 text-blue-300" />;
    default:
      return <Sun className="h-8 w-8 text-amber-500" />;
  }
};

// Mock streak data
const mockStreakData = {
  currentStreak: 4,
  highestStreak: 12,
  lastWeekActivities: [
    { date: "2025-04-09", completed: true } as StreakActivity,
    { date: "2025-04-10", completed: true } as StreakActivity,
    { date: "2025-04-11", completed: true } as StreakActivity,
    { date: "2025-04-12", completed: true } as StreakActivity,
    { date: "2025-04-13", completed: false } as StreakActivity,
    { date: "2025-04-14", completed: false } as StreakActivity,
    { date: "2025-04-15", completed: false } as StreakActivity
  ]
};

// Motivational messages based on streak
const getStreakMessage = (streak: number) => {
  if (streak === 0) return "Start your streak today!";
  if (streak < 3) return "You're on your way! Keep it going!";
  if (streak < 7) return "Amazing consistency! You're building a great habit!";
  if (streak < 14) return "Impressive streak! Your dog is loving the routine!";
  return "Wow! You're a walking champion! Your dedication is amazing!";
};

const Overview = () => {
  // --- Local Storage Integration ---
  // Helper functions
  const getLocalStorage = (key: string, fallback: any) => {
    if (typeof window === 'undefined') return fallback;
    const stored = localStorage.getItem(key);
    try {
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };
  const setLocalStorage = (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  };

  // --- Weekly Summary State ---
  const [weeklySummary] = useState<WeeklySummary>({
    totalWalks: 0,
    totalDistance: 0,
    totalMinutes: 0,
    walksCompletion: 0,
    distanceCompletion: 0,
    minutesCompletion: 0,
  });
  useEffect(() => {
    setLocalStorage('weeklySummary', weeklySummary);
  }, [weeklySummary]);

  // --- Streak Data State ---
  const [streakData] = useState(() => getLocalStorage('streakData', mockStreakData));
  useEffect(() => {
    setLocalStorage('streakData', streakData);
  }, [streakData]);

  // --- Joined Events State ---
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);
  useEffect(() => {
    const storedEvents = localStorage.getItem('joinedEvents');
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents) as string[];
        setJoinedEvents(parsedEvents);
      } catch (error) {
        console.error('Error parsing joined events:', error);
        setJoinedEvents([]);
      }
    }
  }, []);

  // Filter for events the user has joined (check attendees list or joinedEventIds)
  const joinedEventsFiltered = mockEvents.filter(event => joinedEvents.includes(event.id));
  
  // Function to calculate days until event (using date string)
  const calculateDaysUntilEvent = (day: string): number => {
    const eventDate = new Date(day);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Filter and sort upcoming joined events
  const upcomingJoinedEvents = joinedEventsFiltered
    .map(event => ({
      ...event,
      parsedDate: new Date(event.date + 'T' + event.time.replace(' ', '')),
      location: {
        ...event.location,
        coordinates: event.location.coordinates
      },
      host: {
        ...event.host,
        imageUrl: event.host.avatar // Map avatar to imageUrl for compatibility
      }
    }))
    .filter(event => event.parsedDate >= new Date())
    .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

  // Get the very next event
  const nextEvent = upcomingJoinedEvents.length > 0 ? upcomingJoinedEvents[0] : null;
  const daysUntilNextEvent = nextEvent ? calculateDaysUntilEvent(nextEvent.date) : undefined;

  // Calculate weekly stats based on mock data
  const startOfCurrentWeek = startOfWeek(new Date());
  const endOfCurrentWeek = endOfWeek(new Date());
  
  // Weekly goals
  const [weeklyGoals] = useState<WeeklyGoals>({
    walks: 10,
    distance: 20,
    minutes: 300,
  });
  
  // Handle joining an event
  const handleJoinEvent = (eventId: string): void => {
    setJoinedEvents(prev => {
      const newJoinedEvents = prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId];
      
      // Update localStorage with proper type casting
      localStorage.setItem('joinedEvents', JSON.stringify(newJoinedEvents));
      return newJoinedEvents;
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" className="w-full sm:w-auto space-x-2 justify-center">
          <Calendar className="h-4 w-4" />
          <span>Calendar</span>
        </Button>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="myEvents">My Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
            {/* Upcoming Group Walks Card - Updated props */}
            <div className="lg:col-span-2">
              <GroupWalkCard nextEvent={nextEvent} daysUntil={daysUntilNextEvent} />
            </div>
            
            {/* Dog Profile Card */}
            <div>
              <DogProfileCard dogs={mockDogs} />
            </div>
          </div>
          
          {/* Activity Streak - New Component */}
          <Card>
            <CardHeader className="px-4 sm:px-6 pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Activity Streak
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row gap-6 sm:items-center justify-between">
                <div className="flex items-start gap-6">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold flex items-center gap-1">
                      {streakData.currentStreak} 
                      <Flame className="h-6 w-6 text-orange-500" />
                    </div>
                    <div className="text-sm text-muted-foreground">Current Streak</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold">{streakData.highestStreak}</div>
                    <div className="text-sm text-muted-foreground">Highest Streak</div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 mt-2 sm:mt-0">
                  <div className="text-sm font-medium">Last 7 Days</div>
                  <div className="flex gap-1">
                    {streakData.lastWeekActivities.map((day: StreakActivity, index: number) => (
                      <div 
                        key={index} 
                        className={`w-8 h-8 rounded-full flex items-center justify-center 
                          ${day.completed 
                            ? 'bg-green-100 text-green-700 border border-green-300' 
                            : index === streakData.lastWeekActivities.length - 1 
                              ? 'bg-amber-50 text-amber-700 border border-amber-300 border-dashed' 
                              : 'bg-gray-100 text-gray-400 border border-gray-200'
                          }`}
                        title={format(new Date(day.date), 'MMM d, yyyy')}
                      >
                        {format(new Date(day.date), 'dd')}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 mt-4 sm:mt-0">
                  <p className="text-sm text-orange-800">
                    <span className="font-semibold">
                      {getStreakMessage(streakData.currentStreak)}
                    </span>
                    <br />
                    Take your dog for a walk today to keep your streak going!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Weather forecast for next event - New Component */}
          {nextEvent && (
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 sm:px-6 py-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Weather Forecast for Your Next Event
                </h3>
                <p className="text-white/90 text-sm mt-1">
                  {format(new Date(nextEvent.date + 'T00:00:00'), 'EEEE, MMMM d')} • {nextEvent.time}
                </p>
              </div>
              
              <CardContent className="pt-4 px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
                  <div className="flex items-center gap-3">
                    {getWeatherIcon(mockWeatherData.condition)}
                    <div>
                      <div className="text-2xl font-bold">{mockWeatherData.temperature}°C</div>
                      <div className="text-sm text-muted-foreground">{mockWeatherData.condition === 'rainy' ? 'Rainy' : mockWeatherData.condition === 'sunny' ? 'Sunny' : 'Cloudy'}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm flex-1">
                    <div>
                      <div className="text-muted-foreground">High / Low</div>
                      <div className="font-medium">{mockWeatherData.temperature}°C</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Precipitation</div>
                      <div className="font-medium">{mockWeatherData.condition === 'rainy' ? 'High' : mockWeatherData.condition === 'sunny' ? 'Low' : 'None'}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Wind</div>
                      <div className="font-medium">{mockWeatherData.condition === 'windy' ? 'High' : 'Low'}</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                    <span className="font-medium text-foreground">Weather tip:</span> {' '}
                    {mockWeatherData.condition === 'rainy' 
                      ? 'Bring a raincoat for you and your dog!' 
                      : mockWeatherData.condition === 'sunny' && mockWeatherData.temperature > 25
                      ? 'Keep your dog hydrated and watch for hot surfaces!'
                      : 'Perfect walking weather for you and your dog!'}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Weekly Activity Summary - New Component */}
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Weekly Activity Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {/* Walks */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">Walks</span>
                    </div>
                    <span className="text-lg font-bold">{weeklySummary.totalWalks}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{weeklySummary.totalWalks}/{weeklyGoals.walks} walks</span>
                    </div>
                    <Progress value={weeklySummary.walksCompletion} className="h-2" />
                  </div>
                </div>
                
                {/* Distance */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">Distance</span>
                    </div>
                    <span className="text-lg font-bold">{weeklySummary.totalDistance.toFixed(1)} km</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{weeklySummary.totalDistance.toFixed(1)}/{weeklyGoals.distance} km</span>
                    </div>
                    <Progress value={weeklySummary.distanceCompletion} className="h-2" />
                  </div>
                </div>
                
                {/* Time */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Timer className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">Time</span>
                    </div>
                    <span className="text-lg font-bold">{weeklySummary.totalMinutes} min</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{weeklySummary.totalMinutes}/{weeklyGoals.minutes} min</span>
                    </div>
                    <Progress value={weeklySummary.minutesCompletion} className="h-2" />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">This week:</span> {format(startOfCurrentWeek, 'MMM d')} - {format(endOfCurrentWeek, 'MMM d, yyyy')}
                </div>
                <Button variant="link" size="sm" className="text-sm p-0">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Nearby Events - New Component */}
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Events Near You
                </CardTitle>
                <Button variant="link" size="sm" className="text-sm p-0">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-4">
                {mockNearbyEvents.map((event) => (
                  <div key={event.id} className="flex gap-3 border-b pb-4 last:border-0 last:pb-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={event.avatar || event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm sm:text-base truncate pr-1">{event.title}</h3>
                        <span className="text-xs flex-shrink-0 bg-primary/10 text-primary px-2 rounded-full">
                          {event.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{event.shortDescription}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{format(new Date(event.date + 'T00:00:00'), 'MMM d')}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{event.distance} km away</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Activity className="h-3 w-3 flex-shrink-0" />
                          <span>{event.difficultyLevel}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-7 text-xs gap-1"
                          onClick={() => handleJoinEvent(event.id)}
                        >
                          <Plus className="h-3 w-3" /> Join
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Walks */}
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-1">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Evening Park Walk</h3>
                      <p className="text-sm text-muted-foreground">30 minutes • 2.1 km</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 sm:mt-0">Today, 6:30 PM</p>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-1">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Morning Run</h3>
                      <p className="text-sm text-muted-foreground">45 minutes • 3.5 km</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 sm:mt-0">Yesterday, 7:15 AM</p>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Neighborhood Stroll</h3>
                      <p className="text-sm text-muted-foreground">20 minutes • 1.2 km</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 sm:mt-0">2 days ago, 5:45 PM</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-4 sm:px-6">
              <Button variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                View All Activities
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="myEvents" className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">My Events</h2>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Use upcomingJoinedEvents here to only show future events user joined */}
            {upcomingJoinedEvents.map(event => (
              <Card key={event.id} className="overflow-hidden">
                <div className="h-32 sm:h-40 w-full overflow-hidden">
                  <img 
                    src={event.avatar || event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-base sm:text-lg line-clamp-1">{event.title}</h3>
                    <span className="text-xs flex-shrink-0 bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {event.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{event.shortDescription}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs sm:text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    {/* Format the string date */}
                    <span className="truncate">{format(new Date(event.date + 'T00:00:00'), 'MMM d, yyyy')} • {event.time}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    {/* Render location name */}
                    <span className="truncate">{event.location.name}</span> 
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-3 sm:p-4">
                  <div className="text-xs sm:text-sm text-muted-foreground">
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