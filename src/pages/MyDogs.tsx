import { useState } from "react";
import { DogProfile, DogFormData, useDogs, DogList } from "@/domains/dogs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import DogProfileForm from "@/components/dogs/DogProfileForm";
import DogProfileView from "@/components/dogs/DogProfileView";

const MyDogs = () => {
  const { createDog, updateDog } = useDogs();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingDog, setEditingDog] = useState<DogProfile | null>(null);
  const [selectedDog, setSelectedDog] = useState<DogProfile | null>(null);

  const handleAddDog = async (data: DogFormData) => {
    try {
      await createDog({
        ...data,
        owner: "user1", // In a real app this would be the current user's ID
        gender: data.gender || 'male', // Provide default values for required fields
        size: data.size || 'medium',
        energyLevel: data.energyLevel || 'moderate',
        trainingLevel: data.trainingLevel || 'beginner'
      });
      setIsAddOpen(false);
    } catch (error) {
      console.error('Failed to add dog:', error);
    }
  };

  const handleEditDog = async (data: DogFormData) => {
    if (!editingDog) return;
    
    try {
      await updateDog(editingDog.id, data);
      setEditingDog(null);
    } catch (error) {
      console.error('Failed to update dog:', error);
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

      <DogList onSelectDog={setSelectedDog} />

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