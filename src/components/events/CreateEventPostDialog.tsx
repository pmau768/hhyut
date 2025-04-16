import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DogAbility } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Upload, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

// Schema for form validation
const eventPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  shortDescription: z.string().min(10, "Description must be at least 10 characters").max(150),
  description: z.string().min(20, "Description must be at least 20 characters"),
  date: z.date(),
  time: z.string(),
  locationName: z.string().min(2, "Location name is required"),
  locationAddress: z.string().min(5, "Address is required"),
  category: z.enum(["Walk", "Run", "Training", "Playdate", "Social", "Other"]),
  maxAttendees: z.coerce.number().min(1).default(10),
  useCurrentLocation: z.boolean().default(false),
  
  // New dog requirement fields
  difficultyLevel: z.enum(["Easy", "Moderate", "Challenging"]).default("Easy"),
  requiredAbilities: z.array(z.string()).default([]),
  suitableEnergyLevels: z.array(z.enum(["Low", "Medium", "High"])).default(["Low", "Medium", "High"]),
  suitableDogSizes: z.array(z.enum(["Small", "Medium", "Large", "Any"])).default(["Any"]),
  minAge: z.coerce.number().min(0).max(20).default(0),
  breedRecommendations: z.string().optional(),
  notRecommendedFor: z.string().optional(),
});

type EventPostFormData = z.infer<typeof eventPostSchema>;

interface CreateEventPostDialogProps {
  onSubmit: (data: EventPostFormData, image: File | null) => void;
  isLoading?: boolean;
}

const dogAbilityOptions: { id: DogAbility; label: string }[] = [
  { id: "Running", label: "Running (Steady pace)" },
  { id: "Sprinting", label: "Sprinting (Fast bursts)" },
  { id: "Climbing", label: "Climbing (Hills/Terrain)" },
  { id: "Swimming", label: "Swimming" },
  { id: "Jumping", label: "Jumping (Over obstacles)" },
  { id: "OffLeash", label: "Off-Leash Control" },
  { id: "Socialization", label: "Socialization (Good with other dogs)" },
  { id: "BasicCommands", label: "Basic Commands" },
  { id: "AdvancedCommands", label: "Advanced Commands" }
];

const CreateEventPostDialog = ({ onSubmit, isLoading }: CreateEventPostDialogProps) => {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const form = useForm<EventPostFormData>({
    resolver: zodResolver(eventPostSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      date: new Date(),
      time: "12:00",
      locationName: "",
      locationAddress: "",
      category: "Social",
      maxAttendees: 10,
      useCurrentLocation: false,
      difficultyLevel: "Easy",
      requiredAbilities: [],
      suitableEnergyLevels: ["Low", "Medium", "High"],
      suitableDogSizes: ["Any"],
      minAge: 0,
      breedRecommendations: "",
      notRecommendedFor: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("Image size exceeds 5MB limit. Please select a smaller image.");
      e.target.value = '';
      return;
    }
    
    setImageFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (data: EventPostFormData) => {
    // Process string fields that should be arrays
    const processedData = {
      ...data,
      breedRecommendations: data.breedRecommendations 
        ? data.breedRecommendations.split(',').map(b => b.trim()) 
        : [],
      notRecommendedFor: data.notRecommendedFor 
        ? data.notRecommendedFor.split(',').map(b => b.trim()) 
        : [],
    };
    
    onSubmit(processedData as any, imageFile);
    setOpen(false);
    form.reset();
    setImagePreview(null);
    setImageFile(null);
    setIsAdvancedOpen(false);
  };

  const onUseCurrentLocationChange = (checked: boolean) => {
    form.setValue("useCurrentLocation", checked);
    
    if (checked) {
      // Get current location when toggled on
      navigator.geolocation.getCurrentPosition(
        () => {
          // Here you would normally do a reverse geocoding to get the address
          // For now, just setting placeholder values
          form.setValue("locationName", "Current Location");
          form.setValue("locationAddress", "Based on your current coordinates");
        },
        (error) => {
          console.error("Error getting location", error);
          form.setValue("useCurrentLocation", false);
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Share a dog-friendly event with the community
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Morning Park Run" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Brief summary of your event (shown in cards)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This will be displayed on event cards (max 150 chars)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your event in detail..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="useCurrentLocation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Use Current Location</FormLabel>
                      <FormDescription>
                        Automatically use your current location
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={onUseCurrentLocationChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="locationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Central Park" 
                          {...field}
                          disabled={form.watch("useCurrentLocation")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="locationAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. 123 Main St, City" 
                          {...field}
                          disabled={form.watch("useCurrentLocation")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Walk">Walk</SelectItem>
                          <SelectItem value="Run">Run</SelectItem>
                          <SelectItem value="Training">Training</SelectItem>
                          <SelectItem value="Playdate">Playdate</SelectItem>
                          <SelectItem value="Social">Social</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxAttendees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Attendees</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Accordion
                type="single" 
                collapsible
                value={isAdvancedOpen ? "dog-requirements" : undefined}
                onValueChange={(value) => setIsAdvancedOpen(value === "dog-requirements")}
                className="w-full"
              >
                <AccordionItem value="dog-requirements" className="border rounded-lg px-4">
                  <AccordionTrigger className="py-3">
                    <span className="flex items-center gap-2">
                      Dog Requirements & Recommendations
                      {form.watch("difficultyLevel") !== "Easy" || 
                       form.watch("requiredAbilities").length > 0 || 
                       form.watch("suitableEnergyLevels").length < 3 ? (
                        <Badge variant="outline" className="ml-2">
                          Requirements Set
                        </Badge>
                      ) : null}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-2">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="difficultyLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Difficulty Level</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select difficulty" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Easy">Easy - Suitable for all dogs</SelectItem>
                                  <SelectItem value="Moderate">Moderate - Some experience needed</SelectItem>
                                  <SelectItem value="Challenging">Challenging - Experienced dogs only</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Choose how challenging this event will be for dogs
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="requiredAbilities"
                          render={() => (
                            <FormItem>
                              <div className="mb-2">
                                <FormLabel>Required Dog Abilities</FormLabel>
                                <FormDescription>
                                  Select abilities dogs should have for this event
                                </FormDescription>
                              </div>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {dogAbilityOptions.map((option) => (
                                  <FormField
                                    key={option.id}
                                    control={form.control}
                                    name="requiredAbilities"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={option.id}
                                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(option.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, option.id])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== option.id
                                                      )
                                                    );
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="text-sm font-normal">
                                            {option.label}
                                          </FormLabel>
                                        </FormItem>
                                      );
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="suitableEnergyLevels"
                            render={() => (
                              <FormItem>
                                <FormLabel>Suitable Energy Levels</FormLabel>
                                <div className="space-y-2">
                                  {(['Low', 'Medium', 'High'] as const).map((energy) => (
                                    <FormField
                                      key={energy}
                                      control={form.control}
                                      name="suitableEnergyLevels"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={energy}
                                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(energy)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...field.value, energy])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) => value !== energy
                                                        )
                                                      );
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="text-sm font-normal">
                                              {energy} Energy
                                            </FormLabel>
                                          </FormItem>
                                        );
                                      }}
                                    />
                                  ))}
                                </div>
                                <FormDescription>
                                  Select which energy levels are suitable
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="suitableDogSizes"
                            render={() => (
                              <FormItem>
                                <FormLabel>Suitable Dog Sizes</FormLabel>
                                <div className="space-y-2">
                                  {(['Small', 'Medium', 'Large', 'Any'] as const).map((size) => (
                                    <FormField
                                      key={size}
                                      control={form.control}
                                      name="suitableDogSizes"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={size}
                                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(size)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...field.value, size])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) => value !== size
                                                        )
                                                      );
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="text-sm font-normal">
                                              {size} Dogs
                                            </FormLabel>
                                          </FormItem>
                                        );
                                      }}
                                    />
                                  ))}
                                </div>
                                <FormDescription>
                                  Select which dog sizes can participate
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="minAge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Dog Age (in months)</FormLabel>
                              <FormControl>
                                <Input type="number" min={0} max={240} {...field} />
                              </FormControl>
                              <FormDescription>
                                Enter 0 if there's no minimum age requirement
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 gap-4">
                          <FormField
                            control={form.control}
                            name="breedRecommendations"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Recommended Breeds (Optional)</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g. Border Collie, Labrador, Shepherd (comma separated)" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  List breeds that particularly excel at this activity
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="notRecommendedFor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Not Recommended For (Optional)</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g. puppies, senior dogs, brachycephalic breeds" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  List any specific conditions or breeds that might struggle
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="space-y-2">
                <FormLabel>Event Image</FormLabel>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/30 transition-colors cursor-pointer",
                    imagePreview ? "border-primary/50" : "border-muted"
                  )}
                  onClick={() => document.getElementById("event-image")?.click()}
                >
                  {imagePreview ? (
                    <div className="relative w-full aspect-video overflow-hidden rounded-md">
                      <img
                        src={imagePreview}
                        alt="Event preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="py-8">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-sm font-medium">
                        Click to upload an image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG or GIF up to 5MB
                      </p>
                    </div>
                  )}
                  <Input
                    id="event-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "Posting..." : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventPostDialog; 