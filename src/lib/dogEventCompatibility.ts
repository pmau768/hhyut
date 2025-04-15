import { DogProfile, Event } from "./types";

// Calculate compatibility score between dog and event (0-100%)
export function calculateDogEventCompatibility(dog: DogProfile, event: Event): number {
  // If there's no specific requirements, all dogs are 100% compatible
  if (
    !event.difficultyLevel &&
    (!event.requiredAbilities || event.requiredAbilities.length === 0) &&
    (!event.suitableEnergyLevels || event.suitableEnergyLevels.length === 3) &&
    (!event.suitableDogSizes || event.suitableDogSizes.includes("Any")) &&
    (!event.minAge || event.minAge === 0) &&
    (!event.notRecommendedFor || event.notRecommendedFor.length === 0)
  ) {
    return 100;
  }

  let score = 100;
  const reasons: string[] = [];

  // Check energy level compatibility
  if (event.suitableEnergyLevels && !event.suitableEnergyLevels.includes(dog.energy)) {
    score -= 30;
    reasons.push(`Energy level ${dog.energy} not suitable`);
  }

  // Check dog size compatibility (simple logic based on breed size)
  if (event.suitableDogSizes && !event.suitableDogSizes.includes("Any")) {
    const dogSize = estimateDogSize(dog.breed);
    if (!event.suitableDogSizes.includes(dogSize)) {
      score -= 20;
      reasons.push(`Size ${dogSize} may not be suitable`);
    }
  }

  // Check age compatibility (dog age in years, event minAge in months)
  if (event.minAge && event.minAge > 0) {
    const dogAgeInMonths = dog.age * 12;
    if (dogAgeInMonths < event.minAge) {
      score -= 40;
      reasons.push(`Dog is too young (minimum age: ${event.minAge} months)`);
    }
  }

  // Check difficulty level
  if (event.difficultyLevel) {
    if (event.difficultyLevel === "Challenging" && dog.age < 2) {
      score -= 25;
      reasons.push("Challenging events are difficult for young dogs");
    } else if (event.difficultyLevel === "Moderate" && dog.age < 1) {
      score -= 15;
      reasons.push("Moderate events may be difficult for puppies");
    }
  }

  // Check off-leash requirement
  if (
    event.requiredAbilities &&
    event.requiredAbilities.includes("OffLeash") &&
    !dog.isGoodOffLeash
  ) {
    score -= 35;
    reasons.push("Event requires off-leash skills");
  }

  // Event may not be suitable for certain breeds
  if (event.notRecommendedFor && event.notRecommendedFor.length > 0) {
    // Check if dog breed matches any not recommended breed
    // This is a simplified check - would be better with breed categories
    const lowerBreed = dog.breed.toLowerCase();
    const matchesNotRecommended = event.notRecommendedFor.some(
      item => lowerBreed.includes(item.toLowerCase())
    );
    
    if (matchesNotRecommended) {
      score -= 30;
      reasons.push("Breed may not be suitable for this activity");
    }
  }

  // If specified breeds are recommended, give bonus to matching breeds
  if (event.breedRecommendations && event.breedRecommendations.length > 0) {
    // Check if dog breed matches any recommended breed
    const lowerBreed = dog.breed.toLowerCase();
    const matchesRecommended = event.breedRecommendations.some(
      breed => lowerBreed.includes(breed.toLowerCase())
    );
    
    if (matchesRecommended) {
      score += 15;
      score = Math.min(score, 100); // Cap at 100%
      reasons.push("Breed is well-suited for this activity");
    }
  }

  // Ensure score stays within 0-100 range
  score = Math.max(0, Math.min(score, 100));
  
  return score;
}

// Helper function to estimate dog size based on breed
// This is a simplified approach - would be better with a proper breed database
export function estimateDogSize(breed: string): "Small" | "Medium" | "Large" {
  const lowerBreed = breed.toLowerCase();
  
  // Small dog breeds
  const smallBreeds = [
    "chihuahua", "yorkie", "yorkshire", "pomeranian", "maltese", "shih tzu", 
    "toy", "miniature", "terrier", "dachshund", "poodle", "bichon", "havanese",
    "pug", "papillon", "pekingese"
  ];
  
  // Large dog breeds
  const largeBreeds = [
    "shepherd", "retriever", "labrador", "mastiff", "newfoundland", 
    "great dane", "rottweiler", "doberman", "husky", "malamute", 
    "bernese", "pyrenees", "leonberger", "wolfhound", "deerhound",
    "saint bernard", "bloodhound", "greyhound", "malinois"
  ];
  
  // Check for small breeds
  if (smallBreeds.some(smallBreed => lowerBreed.includes(smallBreed))) {
    return "Small";
  }
  
  // Check for large breeds
  if (largeBreeds.some(largeBreed => lowerBreed.includes(largeBreed))) {
    return "Large";
  }
  
  // Default to medium if no match
  return "Medium";
}

// Get recommendation reasons for a dog-event match
export function getCompatibilityReasons(dog: DogProfile, event: Event): {
  score: number;
  positives: string[];
  negatives: string[];
} {
  const positives: string[] = [];
  const negatives: string[] = [];
  
  // Energy level match
  if (event.suitableEnergyLevels) {
    if (event.suitableEnergyLevels.includes(dog.energy)) {
      positives.push(`Great energy level match (${dog.energy})`);
    } else {
      negatives.push(`This event works best with ${event.suitableEnergyLevels.join("/")} energy dogs`);
    }
  }
  
  // Size compatibility
  if (event.suitableDogSizes && !event.suitableDogSizes.includes("Any")) {
    const dogSize = estimateDogSize(dog.breed);
    if (event.suitableDogSizes.includes(dogSize)) {
      positives.push(`Good size match for this activity`);
    } else {
      negatives.push(`This event is best for ${event.suitableDogSizes.join("/")} sized dogs`);
    }
  }
  
  // Age compatibility
  if (event.minAge && event.minAge > 0) {
    const dogAgeInMonths = dog.age * 12;
    if (dogAgeInMonths >= event.minAge) {
      positives.push(`${dog.name} meets the minimum age requirement`);
    } else {
      negatives.push(`Minimum age requirement: ${event.minAge} months`);
    }
  }
  
  // Off-leash ability
  if (event.requiredAbilities && event.requiredAbilities.includes("OffLeash")) {
    if (dog.isGoodOffLeash) {
      positives.push(`${dog.name} has good off-leash control`);
    } else {
      negatives.push(`This event requires off-leash reliability`);
    }
  }
  
  // Breed suitability
  if (event.breedRecommendations && event.breedRecommendations.length > 0) {
    const lowerBreed = dog.breed.toLowerCase();
    const matchesRecommended = event.breedRecommendations.some(
      breed => lowerBreed.includes(breed.toLowerCase())
    );
    
    if (matchesRecommended) {
      positives.push(`${dog.breed}s typically excel at this activity`);
    }
  }
  
  // Breed cautions
  if (event.notRecommendedFor && event.notRecommendedFor.length > 0) {
    const lowerBreed = dog.breed.toLowerCase();
    const matchesNotRecommended = event.notRecommendedFor.some(
      item => lowerBreed.includes(item.toLowerCase())
    );
    
    if (matchesNotRecommended) {
      negatives.push(`This activity may be challenging for ${dog.breed}s`);
    }
  }
  
  // Difficulty level
  if (event.difficultyLevel) {
    if (event.difficultyLevel === "Easy") {
      positives.push("This is an easy event suitable for all dogs");
    } else if (event.difficultyLevel === "Moderate") {
      if (dog.age >= 1) {
        positives.push("This event has moderate difficulty");
      } else {
        negatives.push("May be challenging for puppies under 1 year");
      }
    } else if (event.difficultyLevel === "Challenging") {
      if (dog.age >= 2) {
        if (dog.energy === "High") {
          positives.push("Challenging event perfect for high energy dogs");
        } else {
          negatives.push("This is a high-intensity event");
        }
      } else {
        negatives.push("Very challenging for dogs under 2 years");
      }
    }
  }
  
  // Calculate overall score
  const score = calculateDogEventCompatibility(dog, event);
  
  return {
    score,
    positives,
    negatives
  };
} 