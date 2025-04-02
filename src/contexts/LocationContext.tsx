
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Branch, mockBranches } from '@/models/interfaces/businessInterfaces';

type LocationContextType = {
  currentLocation: Branch | null;
  setCurrentLocation: (location: Branch | null) => void;
  availableLocations: Branch[];
  switchLocation: (locationId: string) => void;
  userHasAccessToLocation: (locationId: string) => boolean;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<Branch | null>(null);
  const [availableLocations, setAvailableLocations] = useState<Branch[]>([]);

  useEffect(() => {
    // In a real app, this would fetch the locations from an API
    // For now, we'll use mock data
    setAvailableLocations(mockBranches.filter(branch => branch.status === 'active'));
    
    // Set the default location if none is selected
    if (!currentLocation && mockBranches.length > 0) {
      const defaultLocation = mockBranches.find(branch => branch.isDefault) || mockBranches[0];
      setCurrentLocation(defaultLocation);
    }
  }, [currentLocation]);

  const switchLocation = (locationId: string) => {
    const location = mockBranches.find(branch => branch.id === locationId);
    if (location) {
      setCurrentLocation(location);
    }
  };

  const userHasAccessToLocation = (locationId: string) => {
    // In a real app, this would check if the user has access to the location
    // For now, we'll assume all users have access to all locations
    return true;
  };

  return (
    <LocationContext.Provider value={{ 
      currentLocation, 
      setCurrentLocation, 
      availableLocations, 
      switchLocation,
      userHasAccessToLocation 
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export { LocationContext };
