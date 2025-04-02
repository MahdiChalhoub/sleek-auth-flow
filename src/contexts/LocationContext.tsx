
import React, { createContext, useContext, useState } from 'react';
import { Branch } from '@/types/location';

type LocationContextType = {
  currentLocation: Branch | null;
  setCurrentLocation: (location: Branch | null) => void;
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

  return (
    <LocationContext.Provider value={{ currentLocation, setCurrentLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export { LocationContext };
