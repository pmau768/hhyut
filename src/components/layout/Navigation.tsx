import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Dog, Calendar, Settings as SettingsIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { TAB_VALUES, ROUTES } from "@/lib/services/routes";

export const DesktopNavigation = () => {
  return (
    <div className="hidden lg:block">
      <TabsList className="grid w-full grid-cols-4 h-14">
        <TabsTrigger value={TAB_VALUES.OVERVIEW} className="text-base" asChild>
          <Link to={ROUTES.OVERVIEW}>Overview</Link>
        </TabsTrigger>
        <TabsTrigger value={TAB_VALUES.MY_DOGS} className="text-base" asChild>
          <Link to={ROUTES.MY_DOGS}>My Dogs</Link>
        </TabsTrigger>
        <TabsTrigger value={TAB_VALUES.EVENTS} className="text-base" asChild>
          <Link to={ROUTES.EVENTS}>Events</Link>
        </TabsTrigger>
        <TabsTrigger value={TAB_VALUES.SETTINGS} className="text-base" asChild>
          <Link to={ROUTES.SETTINGS}>Settings</Link>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export const MobileNavigation = () => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t backdrop-blur-lg bg-background/80 shadow-lg z-40">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value={TAB_VALUES.OVERVIEW} className="py-2 flex flex-col items-center gap-1" asChild>
          <Link to={ROUTES.OVERVIEW}>
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
        </TabsTrigger>
        <TabsTrigger value={TAB_VALUES.MY_DOGS} className="py-2 flex flex-col items-center gap-1" asChild>
          <Link to={ROUTES.MY_DOGS}>
            <Dog className="h-5 w-5" />
            <span className="text-xs">Dogs</span>
          </Link>
        </TabsTrigger>
        <TabsTrigger value={TAB_VALUES.EVENTS} className="py-2 flex flex-col items-center gap-1" asChild>
          <Link to={ROUTES.EVENTS}>
            <Calendar className="h-5 w-5" />
            <span className="text-xs">Events</span>
          </Link>
        </TabsTrigger>
        <TabsTrigger value={TAB_VALUES.SETTINGS} className="py-2 flex flex-col items-center gap-1" asChild>
          <Link to={ROUTES.SETTINGS}>
            <SettingsIcon className="h-5 w-5" />
            <span className="text-xs">Settings</span>
          </Link>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};