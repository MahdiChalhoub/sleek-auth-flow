import React, { createContext, useContext, useState, useEffect } from "react";
import { Branch } from "@/models/interfaces/businessInterfaces";
import { useAuth } from "./AuthContext";
import { mockBranches } from "@/models/interfaces/businessInterfaces";

interface LocationContextType {
  currentLocation: Branch | null;
  availableLocations: Branch[];
  switchLocation: (locationId: string) => void;
  userHasAccessToLocation: (locationId: string) => boolean;
}

const LocationContext = createContext<LocationContextType>({
  currentLocation: null,
  availableLocations: [],
  switchLocation: () => {},
  userHasAccessToLocation: () => false,
});

export const useLocationContext = () => useContext(LocationContext);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, currentBusiness } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<Branch | null>(null);
  const [availableLocations, setAvailableLocations] = useState<Branch[]>([]);

  // In a real application, this would be fetched from an API based on the user's permissions
  useEffect(() => {
    if (!user || !currentBusiness) {
      setAvailableLocations([]);
      setCurrentLocation(null);
      return;
    }

    // Filter locations by current business
    const businessLocations = mockBranches.filter(branch => branch.businessId === currentBusiness.id);
    
    setAvailableLocations(businessLocations);
    
    // If user has only one location, auto-select it
    if (businessLocations.length === 1) {
      setCurrentLocation(businessLocations[0]);
    } 
    // Otherwise, try to find the default location or just use the first one
    else if (businessLocations.length > 0) {
      const defaultLocation = businessLocations.find(loc => loc.isDefault) || businessLocations[0];
      setCurrentLocation(defaultLocation);
    }
  }, [currentBusiness, user]);

  const switchLocation = (locationId: string) => {
    const location = availableLocations.find(loc => loc.id === locationId);
    if (location) {
      setCurrentLocation(location);
      // In a real app, you might want to refresh relevant data based on the new location
    }
  };

  const userHasAccessToLocation = (locationId: string) => {
    // In a real app, this would check the user's permissions
    // For now, just check if the location is in the available locations
    return availableLocations.some(loc => loc.id === locationId);
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        availableLocations,
        switchLocation,
        userHasAccessToLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
