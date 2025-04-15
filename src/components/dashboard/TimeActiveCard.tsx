import { Activity } from "lucide-react";
import { Card } from "@/components/ui/card";

const TimeActiveCard = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl lg:text-2xl font-semibold mb-6 flex items-center">
        <Activity className="w-6 h-6 mr-2 text-primary" />
        Time Active
      </h2>
      <div className="h-48 lg:h-56 flex items-center justify-center">
        <div className="flex space-x-6">
          {[
            { day: "Mo", height: "35%" },
            { day: "Tu", height: "45%" },
            { day: "We", height: "60%" },
            { day: "Th", height: "40%" },
            { day: "Fr", height: "75%" },
            { day: "Sa", height: "50%" },
            { day: "Su", height: "30%" },
          ].map(({ day, height }) => (
            <div key={day} className="text-center">
              <div className="h-32 w-5 bg-muted rounded-full relative">
                <div
                  className="absolute bottom-0 w-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ height }}
                />
              </div>
              <span className="text-sm font-medium mt-3 block">{day}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TimeActiveCard;