
import { useContext } from 'react';
import { useLocationContext } from '@/contexts/LocationContext';

export function useLocation() {
  try {
    return useLocationContext();
  } catch (error) {
    console.error('Failed to use location context:', error);
    // Return a fallback object with empty values
    return {
      currentLocation: null,
      setCurrentLocation: () => {},
      availableLocations: [],
      switchLocation: () => {},
      userHasAccessToLocation: () => false
    };
  }
}
