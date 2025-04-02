
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
    console.log('LocationProvider mounted');
    // Filter active branches
    const activeBranches = mockBranches.filter(branch => branch.status === 'active');
    setAvailableLocations(activeBranches);
    
    // Set the default location if none is selected
    if (!currentLocation && activeBranches.length > 0) {
      const defaultLocation = activeBranches.find(branch => branch.isDefault) || activeBranches[0];
      console.log('Setting default location:', defaultLocation);
      setCurrentLocation(defaultLocation);
    }
  }, []);

  const switchLocation = (locationId: string) => {
    console.log('Switching location to:', locationId);
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

  const contextValue = {
    currentLocation, 
    setCurrentLocation, 
    availableLocations, 
    switchLocation,
    userHasAccessToLocation
  };

  console.log('LocationContext value:', contextValue);

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
};

export { LocationContext };
