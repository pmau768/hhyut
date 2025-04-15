import { DogProfile } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

interface DogCardProps {
  dog: DogProfile;
  onEdit: (dog: DogProfile) => void;
  onDelete: (id: string) => void;
}

const DogCard = ({ dog, onEdit, onDelete }: DogCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-6">
        <div className="w-28 h-28 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/20">
          <img
            src={dog.imageUrl}
            alt={dog.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 text-center sm:text-left space-y-2">
          <h3 className="text-2xl font-semibold">{dog.name}</h3>
          <div className="space-y-1">
            <p className="text-muted-foreground">Age: {dog.age}</p>
            <p className="text-muted-foreground">Breed: {dog.breed}</p>
            <p className="text-muted-foreground">Energy: {dog.energy}</p>
            {dog.isGoodOffLeash && (
              <p className="text-emerald-500 font-medium">Good off-leash</p>
            )}
          </div>
        </div>
        <div className="flex sm:flex-col gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={() => onEdit(dog)}
          >
            <Edit2 className="h-5 w-5" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-10 w-10"
            onClick={() => onDelete(dog.id)}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DogCard;