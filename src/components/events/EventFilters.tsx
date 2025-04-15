import { Search, SlidersHorizontal, Calendar as CalendarIcon, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventCategory } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface EventFiltersProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: EventCategory | 'All') => void;
  onSortChange: (sort: string) => void;
  onViewChange: (view: 'grid' | 'list') => void;
  onLocationToggle: (enabled: boolean) => void;
  onRadiusChange: (radius: number) => void;
  locationEnabled: boolean;
  radius: number;
  userLocation: {
    latitude: number | null;
    longitude: number | null;
    loading: boolean;
    error: string | null;
  } | null;
}

const EventFilters = ({
  onSearch,
  onCategoryChange,
  onSortChange,
  onViewChange,
  onLocationToggle,
  onRadiusChange,
  locationEnabled,
  radius,
  userLocation,
}: EventFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-9"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Walk">Walk</SelectItem>
              <SelectItem value="Run">Run</SelectItem>
              <SelectItem value="Training">Training</SelectItem>
              <SelectItem value="Playdate">Playdate</SelectItem>
              <SelectItem value="Social">Social</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          
          <Select onValueChange={onSortChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-asc">Date: Newest</SelectItem>
              <SelectItem value="date-desc">Date: Oldest</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="spots">Available Spots</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onViewChange('grid')}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            id="location-filter"
            checked={locationEnabled}
            onCheckedChange={onLocationToggle}
            disabled={!!userLocation?.error}
          />
          <Label htmlFor="location-filter" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Show Nearby Events
            {userLocation?.loading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </Label>
        </div>

        {locationEnabled && !userLocation?.error && (
          <div className="flex items-center gap-4 flex-1">
            <div className="w-full max-w-xs">
              <Slider
                value={[radius]}
                onValueChange={([value]) => onRadiusChange(value)}
                max={50}
                step={1}
                className="w-full"
              />
            </div>
            <span className="text-sm text-muted-foreground w-20">
              {radius}km radius
            </span>
          </div>
        )}

        {userLocation?.error && (
          <span className="text-sm text-destructive">
            {userLocation.error}
          </span>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button variant="secondary" size="sm" className="h-8">
          <CalendarIcon className="h-3 w-3 mr-1" />
          This Week
        </Button>
        <Button variant="secondary" size="sm" className="h-8">
          <MapPin className="h-3 w-3 mr-1" />
          Near Me
        </Button>
      </div>
    </div>
  );
};

export default EventFilters;