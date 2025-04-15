import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const UpcomingActivityCard = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl lg:text-2xl font-semibold mb-6 flex items-center">
        <Calendar className="w-6 h-6 mr-2 text-primary" />
        Upcoming Activity
      </h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Group Run</h3>
          <p className="text-muted-foreground">Riverside Park</p>
          <p className="text-muted-foreground">Sat 9:00 AM</p>
        </div>
        <div className="flex space-x-3">
          <Button size="lg" className="flex-1">Join</Button>
          <Button size="lg" variant="outline" className="flex-1">Details</Button>
        </div>
      </div>
    </Card>
  );
};

export default UpcomingActivityCard;