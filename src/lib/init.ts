import { initializeLocalStorage } from './localStorage';

export const initializeApp = () => {
  initializeLocalStorage();
  
  // Add any other app initialization code here
  
  console.log('App initialized with local storage');
}; 