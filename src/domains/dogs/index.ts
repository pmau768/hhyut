/**
 * Dogs Domain
 * 
 * This module contains all functionality related to dog profiles,
 * including components, hooks, and services for managing dog data.
 */

// Re-export types
export * from './types';

// Re-export services
export * from './services/dogStorage';

// Re-export hooks
export * from './hooks/useDogs';

// Re-export components
export { default as DogCard } from './components/DogCard';
export { default as DogList } from './components/DogList'; 