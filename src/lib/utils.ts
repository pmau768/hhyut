import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance}km`;
}

/**
 * Calculate days until a given date
 * Handles both string dates and Date objects
 */
export function calculateDaysUntil(date: string | Date): number {
  let targetDate: Date;
  
  if (typeof date === 'string') {
    // Parse the string date
    targetDate = new Date(date);
  } else {
    targetDate = date;
  }
  
  // Set both dates to start of day for accurate calculation
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  targetDate.setHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Format a date for display
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format a date/string to a React-friendly string
 */
export function formatDateForDisplay(date: string | Date): string {
  if (typeof date === 'string') {
    // If it's already a string, check if it's a valid date format
    if (isNaN(Date.parse(date))) {
      // If not a valid date string, return as is
      return date;
    }
    // Otherwise, format it
    return new Date(date).toLocaleDateString();
  }
  
  // If it's a Date object, format it
  return date.toLocaleDateString();
}

// Helper function to safely access location properties
export function getLocationProperty(location: string | { name: string; address: string; coordinates: { lat: number; lng: number } }, 
  property: 'name' | 'address' | 'coordinates'): any {
  if (typeof location === 'string') {
    return location; // Return the string for display
  }
  
  return location[property];
}