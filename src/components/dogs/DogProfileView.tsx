import { DogProfile, DogActivity } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  Route,
} from "lucide-react";

interface DogProfileViewProps {
  dog: DogProfile;
}

const ActivityItem = ({ activity }: { activity: DogActivity }) => (
  <div className="flex items-start space-x-4 p-4 border-b last:border-0">
    <div className="bg-primary/10 p-2 rounded-full">
      <Activity className="w-5 h-5 text-primary" />
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{activity.type}</p>
          <p className="text-sm text-muted-foreground">{activity.date}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">{activity.duration} min</p>
          {activity.distance && (
            <p className="text-sm text-muted-foreground">{activity.distance} km</p>
          )}
        </div>
      </div>
      {activity.notes && (
        <p className="text-sm text-muted-foreground mt-2">{activity.notes}</p>
      )}
    </div>
  </div>
);

const StatCard = ({
  icon: Icon,
  label,
  value,
  unit,
}: {
  icon: any;
  label: string;
  value: number;
  unit: string;
}) => (
  <Card className="p-4">
    <div className="flex items-center space-x-3">
      <div className="bg-primary/10 p-2 rounded-full">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold">
          {value} <span className="text-base font-normal">{unit}</span>
        </p>
      </div>
    </div>
  </Card>
);

const DogProfileView = ({ dog }: DogProfileViewProps) => {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-6">
          <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-primary/20">
            <img
              src={dog.imageUrl}
              alt={dog.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div>
              <h1 className="text-3xl font-bold">{dog.name}</h1>
              <p className="text-muted-foreground">
                {dog.breed} • {dog.age} years old
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Energy Level: {dog.energy}</p>
              {dog.isGoodOffLeash && (
                <p className="text-emerald-500 font-medium">Good off-leash</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
              <Button variant="outline" size="sm">
                <MapPin className="w-4 h-4 mr-2" />
                Track Walk
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Route}
          label="Total Distance"
          value={dog.stats?.totalDistance ?? 0}
          unit="km"
        />
        <StatCard
          icon={Activity}
          label="Activities"
          value={dog.stats?.totalActivities ?? 0}
          unit="total"
        />
        <StatCard
          icon={Clock}
          label="Avg Duration"
          value={dog.stats?.avgDuration ?? 0}
          unit="min"
        />
        <StatCard
          icon={Award}
          label="Current Streak"
          value={dog.stats?.streak ?? 0}
          unit="days"
        />
      </div>

      {/* Activity Tabs */}
      <Card>
        <Tabs defaultValue="activities" className="w-full">
          <TabsList className="w-full border-b rounded-none p-0">
            <TabsTrigger
              value="activities"
              className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Activities
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Events
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="p-0">
            <ScrollArea className="h-[400px]">
              {dog.activities?.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="events" className="p-6">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Event history coming soon!</p>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="p-6">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Progress tracking coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default DogProfileView;