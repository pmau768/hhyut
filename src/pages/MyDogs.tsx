import { useState, useEffect } from "react";
import { DogProfile, DogFormData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import DogProfileForm from "@/components/dogs/DogProfileForm";
import DogCard from "@/components/dogs/DogCard";
import DogProfileView from "@/components/dogs/DogProfileView";

// Mock data - replace with actual data storage
const initialDogs: DogProfile[] = [
  {
    id: "1",
    name: "Oliver",
    age: 4,
    breed: "Malinois",
    energy: "High",
    isGoodOffLeash: true,
    imageUrl: "https://images.unsplash.com/photo-1553882809-a4f57e59501d?auto=format&fit=crop&q=80&w=200&h=200",
    stats: {
      totalDistance: 127.5,
      totalActivities: 48,
      avgDuration: 45,
      streak: 7
    },
    activities: [
      {
        id: "a1",
        type: "Walk",
        date: "2024-04-10",
        duration: 45,
        distance: 3.2,
        notes: "Morning walk in the park"
      },
      {
        id: "a2",
        type: "Training",
        date: "2024-04-10",
        duration: 30,
        notes: "Recall training session"
      },
      {
        id: "a3",
        type: "Run",
        date: "2024-04-09",
        duration: 40,
        distance: 5.1,
        notes: "Evening run"
      }
    ],
    joinedEvents: []
  }
];

const MyDogs = () => {
  // Local Storage Integration
  const getLocalStorage = (key: string, fallback: DogProfile[]) => {
    if (typeof window === 'undefined') return fallback;
    const stored = localStorage.getItem(key);
    try {
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };
  const setLocalStorage = (key: string, value: DogProfile[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  };

  const [dogs, setDogs] = useState<DogProfile[]>(() => getLocalStorage('dogs', initialDogs));
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingDog, setEditingDog] = useState<DogProfile | null>(null);
  const [selectedDog, setSelectedDog] = useState<DogProfile | null>(null);

  // Save to localStorage whenever dogs changes
  useEffect(() => {
    setLocalStorage('dogs', dogs);
  }, [dogs]);

  const handleAddDog = (data: DogFormData) => {
    const newDog: DogProfile = {
      ...data,
      id: crypto.randomUUID(),
      stats: {
        totalDistance: 0,
        totalActivities: 0,
        avgDuration: 0,
        streak: 0
      },
      activities: [],
      joinedEvents: []
    };
    setDogs([...dogs, newDog]);
    setIsAddOpen(false);
  };

  const handleEditDog = (data: DogFormData) => {
    if (!editingDog) return;
    const updatedDogs = dogs.map(dog =>
      dog.id === editingDog.id ? { ...dog, ...data } : dog
    );
    setDogs(updatedDogs);
    setEditingDog(null);
  };

  const handleDeleteDog = (id: string) => {
    setDogs(dogs.filter(dog => dog.id !== id));
    if (selectedDog?.id === id) {
      setSelectedDog(null);
    }
  };

  if (selectedDog) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => setSelectedDog(null)}
          className="mb-6"
        >
          ← Back to My Dogs
        </Button>
        <DogProfileView dog={selectedDog} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Dogs</h1>
          <p className="text-muted-foreground">Manage your dogs' profiles and activities.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Add Dog
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Dog</DialogTitle>
            </DialogHeader>
            <DogProfileForm onSubmit={handleAddDog} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {dogs.map(dog => (
          <div key={dog.id} onClick={() => setSelectedDog(dog)} className="cursor-pointer">
            <DogCard
              dog={dog}
              onEdit={setEditingDog}
              onDelete={handleDeleteDog}
            />
          </div>
        ))}
      </div>

      <Dialog open={!!editingDog} onOpenChange={() => setEditingDog(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Dog Profile</DialogTitle>
          </DialogHeader>
          {editingDog && (
            <DogProfileForm
              initialData={editingDog}
              onSubmit={handleEditDog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyDogs;