import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DogProfile, PlaydateMatch, DogSize, DogPlayStyle } from "@/lib/types";
import { Heart, Calendar, MapPin, Filter, ChevronRight, Users, Paw, AlertCircle } from "lucide-react";

interface PlaydateMatchFinderProps {
  userDogs: DogProfile[];
  onCreatePlaydate: (dogId: string, matchId: string) => void;
}

// Mock function to calculate compatibility - would be replaced with actual algorithm
const calculateCompatibility = (dog1: DogProfile, dog2: DogProfile): number => {
  let score = 50; // Base score
  
  // Size compatibility
  if (dog1.preferredPlaymates?.sizes?.includes(getSizeByBreed(dog2.breed) as DogSize)) {
    score += 10;
  }
  
  // Energy level compatibility
  if (dog1.energy === dog2.energy) {
    score += 15;
  } else if (
    (dog1.energy === 'Medium' && (dog2.energy === 'Low' || dog2.energy === 'High')) ||
    (dog2.energy === 'Medium' && (dog1.energy === 'Low' || dog1.energy === 'High'))
  ) {
    score += 5;
  }
  
  // Age compatibility - dogs within 2 years are most compatible
  const ageDiff = Math.abs(dog1.age - dog2.age);
  if (ageDiff <= 2) {
    score += 15;
  } else if (ageDiff <= 4) {
    score += 5;
  }
  
  // Play style compatibility
  if (dog1.playStyle === dog2.playStyle) {
    score += 10;
  }
  
  return Math.min(100, score);
};

// Helper function to estimate dog size from breed
const getSizeByBreed = (breed: string): string => {
  const smallBreeds = ['Chihuahua', 'Pomeranian', 'Shih Tzu', 'Yorkie', 'Maltese', 'Pug'];
  const largeBreeds = ['Labrador', 'German Shepherd', 'Golden Retriever', 'Rottweiler', 'Husky', 'Malinois'];
  
  if (smallBreeds.some(b => breed.includes(b))) return 'Small';
  if (largeBreeds.some(b => breed.includes(b))) return 'Large';
  return 'Medium';
};

// Mock data - would be replaced with API calls
const mockDogMatches: DogProfile[] = [
  {
    id: "match1",
    name: "Luna",
    age: 3,
    breed: "Labrador Mix",
    energy: "High",
    isGoodOffLeash: true,
    avatar: "https://images.unsplash.com/photo-1605897472359-3d5ab59efa41?auto=format&fit=crop&q=80&w=200",
    stats: { totalDistance: 85.2, totalActivities: 32, avgDuration: 40, streak: 5 },
    activities: [],
    joinedEvents: [],
    playStyle: "Moderate",
    personality: ["Friendly", "Independent"],
    interactionPreference: "Small groups"
  },
  {
    id: "match2",
    name: "Bella",
    age: 2,
    breed: "Beagle",
    energy: "Medium",
    isGoodOffLeash: false,
    avatar: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&q=80&w=200",
    stats: { totalDistance: 62.1, totalActivities: 28, avgDuration: 35, streak: 3 },
    activities: [],
    joinedEvents: [],
    playStyle: "Gentle",
    personality: ["Friendly", "Shy"],
    interactionPreference: "One-on-one"
  },
  {
    id: "match3",
    name: "Max",
    age: 5,
    breed: "German Shepherd",
    energy: "High",
    isGoodOffLeash: true,
    avatar: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80&w=200",
    stats: { totalDistance: 142.7, totalActivities: 53, avgDuration: 55, streak: 9 },
    activities: [],
    joinedEvents: [],
    playStyle: "Rough",
    personality: ["Dominant", "Independent"],
    interactionPreference: "Any"
  }
];

const PlaydateMatchFinder: React.FC<PlaydateMatchFinderProps> = ({ userDogs, onCreatePlaydate }) => {
  const [selectedDogId, setSelectedDogId] = useState<string | null>(userDogs.length > 0 ? userDogs[0].id : null);
  const [matches, setMatches] = useState<PlaydateMatch[]>([]);
  const [filters, setFilters] = useState({
    minCompatibility: 50,
    maxDistance: 15, // miles
    filterBySize: false,
    filterByEnergy: true,
    sizePreference: ["Small", "Medium", "Large"],
    energyPreference: ["Low", "Medium", "High"]
  });
  
  const selectedDog = userDogs.find(dog => dog.id === selectedDogId) || null;
  
  // Calculate matches based on selected dog and filters
  useEffect(() => {
    if (!selectedDog) {
      setMatches([]);
      return;
    }
    
    // In a real implementation, this would be an API call
    const calculatedMatches = mockDogMatches.map(potentialMatch => {
      const compatibilityScore = calculateCompatibility(selectedDog, potentialMatch);
      
      return {
        dogId: potentialMatch.id,
        dogName: potentialMatch.name,
        dogAvatar: potentialMatch.avatar,
        ownerName: "Pet Parent", // This would come from the owner's profile
        ownerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
        compatibilityScore,
        compatibilityFactors: [
          {
            factor: "Energy Level",
            score: selectedDog.energy === potentialMatch.energy ? 100 : 50,
            description: selectedDog.energy === potentialMatch.energy ? 
              "Both dogs have similar energy levels" : 
              "Energy levels differ but may still be compatible"
          },
          {
            factor: "Play Style",
            score: selectedDog.playStyle === potentialMatch.playStyle ? 100 : 70,
            description: "Play styles are complementary"
          },
          {
            factor: "Age",
            score: Math.abs(selectedDog.age - potentialMatch.age) <= 2 ? 100 : 60,
            description: Math.abs(selectedDog.age - potentialMatch.age) <= 2 ?
              "Ages are similar" : "Age difference is manageable"
          }
        ],
        matchReason: compatibilityScore > 75 ? 
          "High compatibility based on energy level and play style" :
          "Moderate match that might make a good playdate"
      };
    }).filter(match => match.compatibilityScore >= filters.minCompatibility);
    
    setMatches(calculatedMatches);
  }, [selectedDogId, filters]);
  
  if (userDogs.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>No Dogs Found</CardTitle>
          <CardDescription>
            You need to add dogs to your profile before you can find playdate matches.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={() => window.location.href = '/my-dogs'}>
            Add a Dog
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Find the Perfect Playdate</h2>
          <p className="text-muted-foreground">
            Match your dog with compatible playmates based on personality, energy level, and play style.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>Nearby</span>
          </Button>
        </div>
      </div>
      
      {/* Dog Selection */}
      <div className="bg-muted p-4 rounded-lg">
        <Label className="mb-2 block text-sm font-medium">Select your dog to find matches</Label>
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
      
      {/* Matching Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Matching Preferences</CardTitle>
          <CardDescription>
            Adjust these settings to find better matches for {selectedDog?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="compatibility">Minimum Compatibility</Label>
                <span className="text-sm font-medium">{filters.minCompatibility}%</span>
              </div>
              <Slider 
                id="compatibility"
                value={[filters.minCompatibility]} 
                min={0} 
                max={100} 
                step={5}
                onValueChange={(value) => setFilters({...filters, minCompatibility: value[0]})}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="distance">Maximum Distance</Label>
                <span className="text-sm font-medium">{filters.maxDistance} miles</span>
              </div>
              <Slider 
                id="distance"
                value={[filters.maxDistance]} 
                min={1} 
                max={50} 
                step={1}
                onValueChange={(value) => setFilters({...filters, maxDistance: value[0]})}
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="filter-energy" 
                checked={filters.filterByEnergy}
                onCheckedChange={(checked) => setFilters({...filters, filterByEnergy: checked})}
              />
              <Label htmlFor="filter-energy">Match energy levels</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="filter-size" 
                checked={filters.filterBySize}
                onCheckedChange={(checked) => setFilters({...filters, filterBySize: checked})}
              />
              <Label htmlFor="filter-size">Match similar sizes</Label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Match Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Heart className="h-5 w-5 text-rose-500" />
          Compatible Matches
          <Badge variant="outline" className="ml-2">{matches.length}</Badge>
        </h3>
        
        {matches.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">No matches found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or expanding your search area to find more matches.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {matches.map(match => (
              <Card key={match.dogId} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={match.dogAvatar} />
                        <AvatarFallback>{match.dogName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{match.dogName}</CardTitle>
                        <CardDescription className="text-xs">
                          Owned by {match.ownerName}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-primary">{match.compatibilityScore}%</span>
                      <span className="text-xs text-muted-foreground">compatible</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-3">
                  <div className="space-y-3">
                    <Progress value={match.compatibilityScore} className="h-2" />
                    
                    <div className="flex flex-wrap gap-2">
                      {match.compatibilityFactors.slice(0, 2).map((factor, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {factor.factor}: {factor.score}%
                        </Badge>
                      ))}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {match.matchReason}
                    </p>
                  </div>
                </CardContent>
                
                <CardFooter className="border-t bg-muted/50 pt-3 flex justify-between">
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => onCreatePlaydate(selectedDogId!, match.dogId)}
                  >
                    Schedule Playdate
                  </Button>
                  <Button variant="ghost" size="sm">
                    View Profile
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaydateMatchFinder; 