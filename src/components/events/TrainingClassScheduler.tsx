import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DogProfile, Event, DogAbility } from "@/lib/types";
import { format, addDays, addWeeks, isAfter, isBefore, isToday } from "date-fns";
import { 
  CalendarIcon, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Star, 
  CheckCircle, 
  AlertCircle, 
  Calendar as CalendarIcon2,
  Search,
  Filter,
  UserCircle,
  Bookmark,
  ArrowUpDown
} from "lucide-react";

interface TrainingClassSchedulerProps {
  userDogs: DogProfile[];
  onBookClass: (classId: string, dogId: string, date: Date) => void;
}

// Mock training classes
const mockTrainingClasses = [
  {
    id: "class1",
    title: "Puppy Basics",
    description: "Essential training for puppies ages 2-6 months. Focuses on socialization, basic commands, and house training.",
    shortDescription: "Foundational training for puppies",
    trainer: {
      id: "trainer1",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
      rating: 4.9,
      experience: "10+ years"
    },
    duration: 60, // minutes
    price: 35,
    location: {
      name: "Pawsitive Training Center",
      address: "123 Main St, New York, NY",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    schedule: [
      { day: "Monday", time: "10:00 AM" },
      { day: "Wednesday", time: "10:00 AM" },
      { day: "Saturday", time: "9:00 AM" }
    ],
    maxAttendees: 6,
    currentAttendees: 3,
    skillLevel: "Beginner",
    targetDogAge: { min: 2, max: 6 }, // months
    abilities: ["BasicCommands", "Socialization"],
    requirements: ["Up-to-date vaccinations", "No aggressive behavior"],
    tags: ["puppy", "beginner", "socialization"],
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "class2",
    title: "Advanced Obedience",
    description: "For dogs who have mastered the basics. This class focuses on off-leash reliability, distance commands, and distractions.",
    shortDescription: "Take your dog's training to the next level",
    trainer: {
      id: "trainer2",
      name: "Michael Rivera",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      rating: 4.8,
      experience: "8 years"
    },
    duration: 75, // minutes
    price: 45,
    location: {
      name: "Canine Excellence Academy",
      address: "456 Park Ave, New York, NY",
      coordinates: { lat: 40.7580, lng: -73.9855 }
    },
    schedule: [
      { day: "Tuesday", time: "6:00 PM" },
      { day: "Thursday", time: "6:00 PM" },
      { day: "Sunday", time: "11:00 AM" }
    ],
    maxAttendees: 8,
    currentAttendees: 5,
    skillLevel: "Intermediate",
    targetDogAge: { min: 12, max: 999 }, // months (1 year+)
    abilities: ["AdvancedCommands", "OffLeash"],
    requirements: ["Completed basic obedience", "Can hold basic positions"],
    tags: ["advanced", "off-leash", "adult-dogs"],
    image: "https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "class3",
    title: "Agility Foundations",
    description: "Introduction to agility equipment and handling techniques. Builds confidence, body awareness, and teamwork.",
    shortDescription: "Start your agility journey",
    trainer: {
      id: "trainer3",
      name: "Emily Chen",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=200",
      rating: 5.0,
      experience: "12 years"
    },
    duration: 60, // minutes
    price: 50,
    location: {
      name: "Agility Training Center",
      address: "789 Sports Lane, Brooklyn, NY",
      coordinates: { lat: 40.6782, lng: -73.9442 }
    },
    schedule: [
      { day: "Monday", time: "5:00 PM" },
      { day: "Wednesday", time: "5:00 PM" },
      { day: "Saturday", time: "2:00 PM" }
    ],
    maxAttendees: 6,
    currentAttendees: 4,
    skillLevel: "Beginner-Intermediate",
    targetDogAge: { min: 12, max: 999 }, // months (1 year+)
    abilities: ["BasicCommands", "Jumping", "Running"],
    requirements: ["No joint issues", "Basic obedience"],
    tags: ["agility", "sport", "active"],
    image: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?auto=format&fit=crop&q=80&w=1200"
  }
];

type DaySchedule = { day: string; time: string };

const dayToNumber = (day: string): number => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days.indexOf(day);
};

const getUpcomingDates = (schedule: DaySchedule[], weeks: number = 4): Date[] => {
  const today = new Date();
  const dates: Date[] = [];
  
  // Generate dates for the next 'weeks' weeks
  for (let week = 0; week < weeks; week++) {
    schedule.forEach(({ day, time }) => {
      const dayNum = dayToNumber(day);
      let date = new Date(today);
      
      // Set to the correct day of the week
      const diff = (dayNum - date.getDay() + 7) % 7;
      date.setDate(date.getDate() + diff + (week * 7));
      
      // Set the time
      const [hours, minutes] = time.split(':')[0].split(' ')[0].split(':');
      const isPM = time.includes('PM');
      date.setHours(
        parseInt(hours) + (isPM && parseInt(hours) !== 12 ? 12 : 0),
        parseInt(minutes || '0')
      );
      
      // Only add future dates
      if (isAfter(date, today)) {
        dates.push(date);
      }
    });
  }
  
  // Sort dates chronologically
  return dates.sort((a, b) => a.getTime() - b.getTime());
};

interface ClassCompatibility {
  dogId: string;
  dogName: string;
  classId: string;
  isCompatible: boolean;
  incompatibilityReasons: string[];
  isIdeal: boolean;
  idealFactors: string[];
}

const calculateClassCompatibility = (
  dog: DogProfile, 
  trainingClass: any
): ClassCompatibility => {
  const incompatibilityReasons: string[] = [];
  const idealFactors: string[] = [];
  
  // Check age compatibility
  const dogAgeMonths = dog.age * 12; // Convert to months
  const tooYoung = dogAgeMonths < trainingClass.targetDogAge.min;
  const tooOld = trainingClass.targetDogAge.max !== 999 && dogAgeMonths > trainingClass.targetDogAge.max;
  
  if (tooYoung) {
    incompatibilityReasons.push(`${dog.name} is too young for this class`);
  }
  if (tooOld) {
    incompatibilityReasons.push(`${dog.name} is older than the target age range`);
  }
  
  // Check skill level match
  const skillLevelMap = {
    "Beginner": ["Low", "Medium"],
    "Intermediate": ["Medium", "High"],
    "Advanced": ["High"]
  };
  
  if (trainingClass.skillLevel === "Intermediate" && dog.energy === "Low") {
    incompatibilityReasons.push("This class may be too challenging for your dog's energy level");
  }
  
  if (trainingClass.skillLevel === "Advanced" && dog.energy !== "High") {
    incompatibilityReasons.push("This class requires high energy dogs");
  }
  
  // Check for ideal matches
  if (trainingClass.skillLevel === "Beginner" && dogAgeMonths <= 8) {
    idealFactors.push("Perfect age for starting puppy training");
  }
  
  if (trainingClass.abilities.includes("OffLeash") && dog.isGoodOffLeash) {
    idealFactors.push("Your dog's off-leash skills are a great match");
  }
  
  if (trainingClass.abilities.some(a => a.includes("Command")) && dog.energy === "Medium") {
    idealFactors.push("Your dog's energy level is perfect for learning commands");
  }
  
  return {
    dogId: dog.id,
    dogName: dog.name,
    classId: trainingClass.id,
    isCompatible: incompatibilityReasons.length === 0,
    incompatibilityReasons,
    isIdeal: idealFactors.length > 0,
    idealFactors
  };
};

const TrainingClassScheduler: React.FC<TrainingClassSchedulerProps> = ({ userDogs, onBookClass }) => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedDogId, setSelectedDogId] = useState<string | null>(userDogs.length > 0 ? userDogs[0].id : null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterSkillLevel, setFilterSkillLevel] = useState<string | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  
  const selectedClass = selectedClassId 
    ? mockTrainingClasses.find(c => c.id === selectedClassId) 
    : null;
  
  const selectedDog = selectedDogId 
    ? userDogs.find(d => d.id === selectedDogId) 
    : null;
  
  const availableDates = selectedClass 
    ? getUpcomingDates(selectedClass.schedule, 4) 
    : [];
  
  const compatibilityResults = userDogs.flatMap(dog => 
    mockTrainingClasses.map(cls => calculateClassCompatibility(dog, cls))
  );
  
  const filteredClasses = mockTrainingClasses
    .filter(cls => !filterSkillLevel || cls.skillLevel === filterSkillLevel);
  
  const handleBookNow = () => {
    if (selectedClassId && selectedDogId && selectedDate) {
      onBookClass(selectedClassId, selectedDogId, selectedDate);
      setIsBookingDialogOpen(false);
      setSelectedDate(null);
    }
  };
  
  const openBookingDialog = (classId: string) => {
    setSelectedClassId(classId);
    setIsBookingDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Training Classes</h2>
          <p className="text-muted-foreground">
            Find and schedule professional training classes for your dog
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search classes..."
              className="pl-8 w-full md:w-[200px]"
            />
          </div>
          
          <Select value={filterSkillLevel || ""} onValueChange={val => setFilterSkillLevel(val || null)}>
            <SelectTrigger className="w-[130px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>{filterSkillLevel || "All Levels"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Dog Selection */}
      {userDogs.length > 0 && (
        <div className="bg-muted p-4 rounded-lg">
          <Label className="mb-2 block text-sm font-medium">Select your dog for compatibility check</Label>
          <div className="flex flex-wrap gap-3">
            {userDogs.map(dog => (
              <Button
                key={dog.id}
                variant={dog.id === selectedDogId ? "default" : "outline"}
                className="flex items-center gap-2"
                onClick={() => setSelectedDogId(dog.id)}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={dog.avatar} />
                  <AvatarFallback>{dog.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{dog.name}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Classes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map(cls => {
          const compatibility = selectedDog 
            ? compatibilityResults.find(c => c.dogId === selectedDog.id && c.classId === cls.id)
            : null;
          
          return (
            <Card key={cls.id} className="overflow-hidden flex flex-col">
              <div className="aspect-video relative">
                <img 
                  src={cls.image} 
                  alt={cls.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <Badge className="bg-primary">
                    {cls.skillLevel}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{cls.title}</CardTitle>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium ml-1">{cls.trainer.rating}</span>
                  </div>
                </div>
                <CardDescription>{cls.shortDescription}</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <UserCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <span className="font-medium">{cls.trainer.name}</span>
                      <span className="text-muted-foreground ml-2">({cls.trainer.experience})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>{cls.duration} minutes</div>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm">
                    <DollarSign className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>${cls.price} per session</div>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm">
                    <CalendarIcon2 className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      {cls.schedule.map(s => `${s.day}s at ${s.time}`).join(', ')}
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>{cls.location.name}</div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 pt-1">
                    {cls.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {compatibility && (
                    <div className="mt-2 pt-2 border-t">
                      {compatibility.isCompatible ? (
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-green-600">
                              Compatible with {compatibility.dogName}
                            </p>
                            {compatibility.isIdeal && compatibility.idealFactors.map((factor, i) => (
                              <p key={i} className="text-xs text-muted-foreground mt-1">
                                {factor}
                              </p>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-amber-600">
                              May not be ideal for {compatibility.dogName}
                            </p>
                            {compatibility.incompatibilityReasons.map((reason, i) => (
                              <p key={i} className="text-xs text-muted-foreground mt-1">
                                {reason}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between gap-2 border-t pt-4">
                <Button 
                  className="flex-1" 
                  onClick={() => openBookingDialog(cls.id)}
                >
                  Book Now
                </Button>
                <Button variant="outline" size="icon" className="w-10">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book Training Class</DialogTitle>
            <DialogDescription>
              Select a date and time for {selectedClass?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="dog">Dog</Label>
              <Select value={selectedDogId || ""} onValueChange={setSelectedDogId}>
                <SelectTrigger id="dog">
                  {selectedDog ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={selectedDog.avatar} />
                        <AvatarFallback>{selectedDog.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{selectedDog.name}</span>
                    </div>
                  ) : (
                    <span>Select a dog</span>
                  )}
                </SelectTrigger>
                <SelectContent>
                  {userDogs.map(dog => (
                    <SelectItem key={dog.id} value={dog.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={dog.avatar} />
                          <AvatarFallback>{dog.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{dog.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1">
              <Label>Available Dates</Label>
              <div className="rounded-md border p-4">
                {availableDates.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableDates.slice(0, 6).map((date, i) => (
                      <Button
                        key={i}
                        variant={selectedDate && selectedDate.getTime() === date.getTime() ? "default" : "outline"}
                        className="justify-start h-auto py-2 px-3"
                        onClick={() => setSelectedDate(date)}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{format(date, 'EEEE')}</span>
                          <span className="text-sm">{format(date, 'MMM d, yyyy - h:mm a')}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No available dates found
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <Label>Class Details</Label>
              {selectedClass && (
                <div className="rounded-md border p-4 mt-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{selectedClass.title}</span>
                    <Badge>{selectedClass.skillLevel}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedClass.duration} min</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>${selectedClass.price}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedClass.location.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedClass.currentAttendees}/{selectedClass.maxAttendees} Enrolled</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <span className="font-medium">{selectedClass.trainer.name}</span>
                      <div className="flex items-center mt-0.5">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs ml-1">{selectedClass.trainer.rating}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({selectedClass.trainer.experience})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleBookNow}
              disabled={!selectedDate || !selectedDogId || !selectedClassId}
            >
              Book Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainingClassScheduler; 