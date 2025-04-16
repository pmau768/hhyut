import { useState } from "react";
import { EventDetails } from "@/components/events/EventDetails";
import { Event, DogProfile } from "@/lib/types";
import { toast } from "sonner";

// Sample data for testing
const mockEvent: Event = {
  id: "event1",
  title: "Advanced Agility Training",
  description: "Join us for an intensive agility training session designed for experienced dogs. Learn advanced techniques and improve your dog's abilities on challenging obstacles.",
  location: "Central Park Dog Training Area",
  date: new Date("2024-06-15"),
  time: "10:00 AM",
  category: "TRAINING",
  host: {
    id: "host1",
    name: "Sarah Wilson",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    bio: "Certified dog trainer with 10+ years of experience"
  },
  requirements: {
    minAge: 2,
    maxAge: 10,
    dogSize: ["medium", "large"],
    energyLevel: "high",
    trainingLevel: "intermediate",
    breeds: ["Border Collie", "Australian Shepherd", "Labrador", "Golden Retriever"]
  },
  attendeeCount: 8,
  tags: ["agility", "training", "advanced", "obstacle course"],
  createdAt: new Date("2024-05-01"),
  updatedAt: new Date("2024-05-01")
};

const mockDogs: DogProfile[] = [
  {
    id: "dog1",
    name: "Max",
    breed: "Border Collie",
    age: 4,
    gender: "male",
    size: "medium",
    energyLevel: "high",
    trainingLevel: "intermediate",
    profileImage: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47",
    description: "Energetic and loves to run",
    owner: "user1",
    createdAt: new Date("2022-01-15"),
    updatedAt: new Date("2023-05-10")
  },
  {
    id: "dog2",
    name: "Bella",
    breed: "Golden Retriever",
    age: 3,
    gender: "female",
    size: "large",
    energyLevel: "moderate",
    trainingLevel: "beginner",
    profileImage: "https://images.unsplash.com/photo-1552053831-71594a27632d",
    description: "Friendly and loves to play fetch",
    owner: "user1",
    createdAt: new Date("2022-02-20"),
    updatedAt: new Date("2023-06-15")
  },
  {
    id: "dog3",
    name: "Cooper",
    breed: "Dachshund",
    age: 5,
    gender: "male",
    size: "small",
    energyLevel: "moderate",
    trainingLevel: "intermediate",
    profileImage: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d",
    description: "Small but mighty, loves adventures",
    owner: "user1",
    createdAt: new Date("2021-10-10"),
    updatedAt: new Date("2023-04-05")
  }
];

export default function EventDetailsTest() {
  const [joinedDogs, setJoinedDogs] = useState<string[]>([]);

  const handleJoinEvent = async (eventId: string, dogId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // This simulates an API call
        try {
          // Check if dog is already joined
          if (joinedDogs.includes(dogId)) {
            toast.error("This dog is already attending the event!");
            reject(new Error("Dog already joined"));
            return;
          }

          setJoinedDogs(prev => [...prev, dogId]);
          toast.success("Successfully joined the event!");
          resolve();
        } catch (error) {
          toast.error("Failed to join the event");
          reject(error);
        }
      }, 1000); // Simulate network delay
    });
  };

  return (
    <div className="container p-6 mx-auto">
      <h1 className="text-2xl font-bold mb-6">Event Details Testing Page</h1>
      <p className="mb-8 text-muted-foreground">
        This page tests the EventDetails component with sample data. The component should show event information 
        and allow joining with eligible dogs.
      </p>
      
      <div className="mb-6 p-4 bg-muted/20 rounded-md">
        <h2 className="font-medium mb-2">Current State:</h2>
        <p>
          Joined Dogs: {joinedDogs.length === 0 ? "None" : joinedDogs.map(id => 
            mockDogs.find(dog => dog.id === id)?.name
          ).join(", ")}
        </p>
      </div>
      
      <EventDetails 
        event={mockEvent}
        userDogs={mockDogs}
        onJoinEvent={handleJoinEvent}
      />
    </div>
  );
} 