import { TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t backdrop-blur-lg bg-background/80">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="overview" className="py-4 text-sm">Overview</TabsTrigger>
        <TabsTrigger value="mydogs" className="py-4 text-sm">My Dogs</TabsTrigger>
        <TabsTrigger value="events" className="py-4 text-sm">Events</TabsTrigger>
        <TabsTrigger value="settings" className="py-4 text-sm">Settings</TabsTrigger>
      </TabsList>
    </div>
  );
};