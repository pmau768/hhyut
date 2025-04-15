import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DogProfile } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Dog } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DogProfileCardProps {
  dogs: DogProfile[];
}

const DogProfileCard = ({ dogs }: DogProfileCardProps) => {
  // Get the primary dog (first one)
  const primaryDog = dogs.length > 0 ? dogs[0] : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dog className="h-5 w-5" />
          My Dogs
        </CardTitle>
      </CardHeader>
      <CardContent>
        {primaryDog ? (
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img 
                  src={primaryDog.imageUrl}
                  alt={primaryDog.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{primaryDog.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {primaryDog.breed} • {primaryDog.age} {primaryDog.age === 1 ? 'year' : 'years'} old
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded-md p-3">
                <div className="text-2xl font-bold">{primaryDog.stats.totalActivities}</div>
                <div className="text-xs text-muted-foreground">Total Activities</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-2xl font-bold">{primaryDog.stats.totalDistance.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">Distance (km)</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-2xl font-bold">{primaryDog.stats.avgDuration}</div>
                <div className="text-xs text-muted-foreground">Avg Duration (min)</div>
              </div>
              <div className="border rounded-md p-3">
                <div className="text-2xl font-bold">{primaryDog.stats.streak}</div>
                <div className="text-xs text-muted-foreground">Current Streak</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{primaryDog.energy} Energy</Badge>
              <Badge variant="outline">
                {primaryDog.isGoodOffLeash ? 'Good off-leash' : 'Needs leash'}
              </Badge>
            </div>
            
            {dogs.length > 1 && (
              <div className="pt-3 flex justify-between items-center border-t">
                <div className="text-sm text-muted-foreground">
                  {dogs.length - 1} more {dogs.length - 1 === 1 ? 'dog' : 'dogs'}
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No dogs added yet</p>
            <Button className="mt-4" variant="outline">Add Dog</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DogProfileCard;