import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Dog, Calendar, Settings as SettingsIcon } from "lucide-react";

export const DesktopNavigation = () => {
  return (
    <div className="hidden lg:block">
      <TabsList className="grid w-full grid-cols-4 h-14">
        <TabsTrigger value="overview" className="text-base">Overview</TabsTrigger>
        <TabsTrigger value="mydogs" className="text-base">My Dogs</TabsTrigger>
        <TabsTrigger value="events" className="text-base">Events</TabsTrigger>
        <TabsTrigger value="settings" className="text-base">Settings</TabsTrigger>
      </TabsList>
    </div>
  );
};

export const MobileNavigation = () => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t backdrop-blur-lg bg-background/80 shadow-lg z-40">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="overview" className="py-2 flex flex-col items-center gap-1">
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </TabsTrigger>
        <TabsTrigger value="mydogs" className="py-2 flex flex-col items-center gap-1">
          <Dog className="h-5 w-5" />
          <span className="text-xs">Dogs</span>
        </TabsTrigger>
        <TabsTrigger value="events" className="py-2 flex flex-col items-center gap-1">
          <Calendar className="h-5 w-5" />
          <span className="text-xs">Events</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="py-2 flex flex-col items-center gap-1">
          <SettingsIcon className="h-5 w-5" />
          <span className="text-xs">Settings</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};