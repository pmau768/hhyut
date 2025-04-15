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
      <CardHeader className="px-4 sm:px-6 pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Dog className="h-5 w-5" />
          My Dogs
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pt-0">
        {primaryDog ? (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex gap-3 sm:gap-4 items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0">
                <img 
                  src={primaryDog.imageUrl}
                  alt={primaryDog.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold">{primaryDog.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {primaryDog.breed} • {primaryDog.age} {primaryDog.age === 1 ? 'year' : 'years'} old
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="border rounded-md p-2 sm:p-3">
                <div className="text-xl sm:text-2xl font-bold">{primaryDog.stats.totalActivities}</div>
                <div className="text-xs text-muted-foreground">Total Activities</div>
              </div>
              <div className="border rounded-md p-2 sm:p-3">
                <div className="text-xl sm:text-2xl font-bold">{primaryDog.stats.totalDistance.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">Distance (km)</div>
              </div>
              <div className="border rounded-md p-2 sm:p-3">
                <div className="text-xl sm:text-2xl font-bold">{primaryDog.stats.avgDuration}</div>
                <div className="text-xs text-muted-foreground">Avg Duration (min)</div>
              </div>
              <div className="border rounded-md p-2 sm:p-3">
                <div className="text-xl sm:text-2xl font-bold">{primaryDog.stats.streak}</div>
                <div className="text-xs text-muted-foreground">Current Streak</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <Badge variant="outline" className="text-xs">{primaryDog.energy} Energy</Badge>
              <Badge variant="outline" className="text-xs">
                {primaryDog.isGoodOffLeash ? 'Good off-leash' : 'Needs leash'}
              </Badge>
            </div>
            
            {dogs.length > 1 && (
              <div className="pt-3 flex justify-between items-center border-t">
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {dogs.length - 1} more {dogs.length - 1 === 1 ? 'dog' : 'dogs'}
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8 text-muted-foreground">
            <p className="text-sm">No dogs added yet</p>
            <Button className="mt-3 sm:mt-4" variant="outline" size="sm">Add Dog</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DogProfileCard;