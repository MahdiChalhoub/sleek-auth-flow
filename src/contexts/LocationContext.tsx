import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Create context type
type LocationContextType = {
  currentLocation: string;
  navigateTo: (path: string) => void;
  // Other location-related properties...
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  // State and other logic...
  const [currentLocation, setCurrentLocation] = useState(location.pathname);

  // Update when location changes
  React.useEffect(() => {
    setCurrentLocation(location.pathname);
    console.log("LocationContext value:", { currentLocation: location.pathname });
  }, [location.pathname]);

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const value = {
    currentLocation,
    navigateTo,
    // Other properties...
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}
