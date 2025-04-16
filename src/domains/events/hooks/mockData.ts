import { Event } from '../types';

// Mock events for testing and initialization
export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Morning Group Run",
    description: "Join us for an energetic morning run with your four-legged friends! All fitness levels welcome. We'll meet at the Central Park entrance and do a scenic loop around the park. This is a great opportunity to exercise with your dog while meeting other pet parents. Remember to bring water for both you and your furry friend. We'll take breaks as needed and keep a moderate pace suitable for all participants.",
    shortDescription: "Group run for dogs and their humans. All fitness levels welcome!",
    avatar: "https://images.unsplash.com/photo-1558430665-6ddd08021c29?auto=format&fit=crop&q=80&w=3000",
    date: "Apr 15, 2024",
    time: "7:00 AM",
    location: {
      name: "Central Park",
      address: "Central Park, New York, NY",
      coordinates: { lat: 40.7829, lng: -73.9654 }
    },
    category: "Run",
    tags: ["running", "fitness", "morning", "social", "all-levels"],
    maxAttendees: 15,
    attendees: [
      {
        id: "currentUser", 
        name: "You",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
        dogName: "Oliver",
        joinedAt: "3 days ago"
      }
    ],
    host: {
      id: "host1",
      name: "Sarah Wilson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
    },
    status: "Open",
    gallery: [
      "https://images.unsplash.com/photo-1558430665-6ddd08021c29?auto=format&fit=crop&q=80&w=3000",
      "https://images.unsplash.com/photo-1562176566-e9afd27531d4?auto=format&fit=crop&q=80&w=3000",
      "https://images.unsplash.com/photo-1558430557-1a420d84c16a?auto=format&fit=crop&q=80&w=3000"
    ],
    comments: [
      {
        id: "c1",
        userId: "u1",
        userName: "John Doe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
        content: "Looking forward to this! Will be my first time joining.",
        createdAt: "2 days ago"
      },
      {
        id: "c2",
        userId: "u2",
        userName: "Emma Smith",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
        content: "The route is beautiful this time of year!",
        createdAt: "1 day ago"
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    // Dog requirements
    difficultyLevel: "Moderate",
    requiredAbilities: ["Running", "OffLeash"],
    suitableEnergyLevels: ["Medium", "High"],
    suitableDogSizes: ["Medium", "Large"],
    minAge: 12, // 1 year minimum
    breedRecommendations: ["Border Collie", "Labrador", "Shepherd", "Husky"],
    notRecommendedFor: ["puppies", "senior dogs", "brachycephalic breeds"],
    duration: 60
  },
  {
    id: "2",
    title: "Puppy Training Workshop",
    description: "Professional training session focusing on basic obedience and socialization. Perfect for puppies aged 3-6 months. Our certified trainer will cover essential commands, leash manners, and proper socialization techniques. Limited spots to ensure individual attention for each puppy. All participants will receive a training guide and certificate of completion.",
    shortDescription: "Learn essential training techniques for your puppy with our certified trainer.",
    avatar: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=3000",
    date: "Apr 16, 2024",
    time: "10:00 AM",
    location: {
      name: "Doggy Academy",
      address: "123 Pet Street, New York, NY",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    category: "Training",
    tags: ["training", "puppies", "beginner", "professional", "certification"],
    maxAttendees: 8,
    attendees: [
      {
        id: "currentUser", 
        name: "You",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
        dogName: "Luna",
        joinedAt: "1 day ago"
      }
    ],
    host: {
      id: "host2",
      name: "Mike Thompson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
    },
    status: "Open",
    gallery: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=3000",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=3000",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=3000"
    ],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    // Dog requirements
    difficultyLevel: "Easy",
    requiredAbilities: ["BasicCommands"],
    suitableEnergyLevels: ["Low", "Medium", "High"],
    suitableDogSizes: ["Any"],
    minAge: 3, // 3 months minimum
    duration: 90
  },
  {
    id: "3",
    title: "Advanced Agility Training",
    description: "Join us for an intensive agility training session designed for experienced dogs. This event features a challenging course with jumps, tunnels, weave poles, and more. Ideal for dogs who already have basic agility skills and are ready to take it to the next level. Handlers should have experience with agility commands and techniques.",
    shortDescription: "Advanced agility course for experienced dogs and handlers.",
    avatar: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?auto=format&fit=crop&q=80&w=3000",
    date: "Apr 20, 2024",
    time: "2:00 PM",
    location: {
      name: "Agility Training Center",
      address: "456 Obstacle Avenue, New York, NY",
      coordinates: { lat: 40.7380, lng: -73.8750 }
    },
    category: "Training",
    tags: ["agility", "advanced", "competition", "obstacle-course"],
    maxAttendees: 12,
    attendees: [],
    host: {
      id: "host3",
      name: "Jessica Rodriguez",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=200"
    },
    status: "Open",
    gallery: [
      "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?auto=format&fit=crop&q=80&w=3000"
    ],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    // Dog requirements
    difficultyLevel: "Challenging",
    requiredAbilities: ["Running", "Jumping", "OffLeash", "AdvancedCommands"],
    suitableEnergyLevels: ["High"],
    suitableDogSizes: ["Small", "Medium", "Large"],
    minAge: 18, // 1.5 years minimum
    breedRecommendations: ["Border Collie", "Australian Shepherd", "Sheltie", "Jack Russell"],
    notRecommendedFor: ["senior dogs", "dogs with joint issues", "brachycephalic breeds"],
    duration: 120
  },
  {
    id: "4",
    title: "Small Dogs Social Hour",
    description: "A fun-filled playtime specially designed for small and toy breeds! This is a great opportunity for your small dog to socialize with other dogs their size in a safe, controlled environment. The play area is fully enclosed and monitored by professional trainers who ensure all dogs are playing nicely.",
    shortDescription: "Playtime and socialization for small and toy breed dogs.",
    avatar: "https://images.unsplash.com/photo-1583511655826-05700a463f78?auto=format&fit=crop&q=80&w=3000",
    date: "Apr 18, 2024",
    time: "5:00 PM",
    location: {
      name: "Little Paws Playground",
      address: "789 Small Street, New York, NY",
      coordinates: { lat: 40.7420, lng: -73.9890 }
    },
    category: "Playdate",
    tags: ["small-dogs", "socializing", "playtime", "toy-breeds"],
    maxAttendees: 15,
    attendees: [],
    host: {
      id: "host4",
      name: "David Chen",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
    },
    status: "Open",
    gallery: [
      "https://images.unsplash.com/photo-1583511655826-05700a463f78?auto=format&fit=crop&q=80&w=3000",
      "https://images.unsplash.com/photo-1544464116-22fd1688a952?auto=format&fit=crop&q=80&w=3000"
    ],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    // Dog requirements
    difficultyLevel: "Easy",
    requiredAbilities: ["Socialization"],
    suitableEnergyLevels: ["Low", "Medium", "High"],
    suitableDogSizes: ["Small"],
    minAge: 6, // 6 months minimum
    duration: 60
  },
  {
    id: "5",
    title: "Weekend Group Walk",
    description: "Enjoy a relaxing weekend walk with other dog owners in the beautiful Riverside Park. This is a casual, social walk where dogs can meet new friends and owners can connect. We'll follow a scenic route along the river with plenty of stops for dogs to sniff and explore. All leashed dogs welcome!",
    shortDescription: "Relaxed group walk along Riverside Park. All leashed dogs welcome.",
    avatar: "https://images.unsplash.com/photo-1532717681384-52308984d3c8?auto=format&fit=crop&q=80&w=3000",
    date: "Apr 17, 2024",
    time: "9:00 AM",
    location: {
      name: "Riverside Park",
      address: "Riverside Drive, New York, NY",
      coordinates: { lat: 40.8010, lng: -73.9723 }
    },
    category: "Walk",
    tags: ["walking", "social", "weekend", "all-dogs"],
    maxAttendees: 20,
    attendees: [],
    host: {
      id: "host5",
      name: "Rachel Kim",
      avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=200"
    },
    status: "Open",
    gallery: [
      "https://images.unsplash.com/photo-1532717681384-52308984d3c8?auto=format&fit=crop&q=80&w=3000",
      "https://images.unsplash.com/photo-1548199956-dc586059705b?auto=format&fit=crop&q=80&w=3000"
    ],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    // Dog requirements
    difficultyLevel: "Easy",
    suitableEnergyLevels: ["Low", "Medium", "High"],
    suitableDogSizes: ["Any"],
    duration: 90
  }
]; 