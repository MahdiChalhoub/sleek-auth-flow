
import { useState, useEffect } from 'react';
import { Branch } from '@/types/location';

export const useLocation = () => {
  const [locations, setLocations] = useState<Branch[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch from the API
        // This is a placeholder implementation
        const mockLocations: Branch[] = [
          { id: 'loc1', name: 'Main Store', isActive: true },
          { id: 'loc2', name: 'Warehouse', isActive: true },
          { id: 'loc3', name: 'Downtown Branch', isActive: true }
        ];
        
        setLocations(mockLocations);
        
        // Set default current location to the first active one
        if (mockLocations.length > 0) {
          const defaultLocation = mockLocations.find(loc => loc.isActive) || mockLocations[0];
          setCurrentLocation(defaultLocation);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error fetching locations'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const changeLocation = (locationId: string) => {
    const newLocation = locations.find(loc => loc.id === locationId);
    if (newLocation) {
      setCurrentLocation(newLocation);
      // Could also store this in localStorage for persistence across sessions
      return true;
    }
    return false;
  };

  return {
    locations,
    currentLocation,
    isLoading,
    error,
    changeLocation
  };
};
