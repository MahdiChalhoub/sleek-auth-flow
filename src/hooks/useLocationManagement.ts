
import { useState } from "react";
import { Branch, mockBranches } from "@/models/interfaces/businessInterfaces";

export const useLocationManagement = (businessId: string) => {
  const [locations, setLocations] = useState<Branch[]>(
    mockBranches.filter(branch => branch.businessId === businessId)
  );
  
  const handleAddLocation = (newLocation: Branch) => {
    setLocations(prev => [...prev, { ...newLocation, businessId }]);
  };
  
  const handleDeleteLocation = (id: string) => {
    if (window.confirm("Are you sure you want to delete this location? This action cannot be undone.")) {
      setLocations(prev => prev.filter(location => location.id !== id));
    }
  };
  
  const handleToggleLocationStatus = (id: string) => {
    setLocations(prev =>
      prev.map(location =>
        location.id === id
          ? { 
              ...location, 
              status: location.status === "active" ? "inactive" : "active" 
            }
          : location
      )
    );
  };

  return {
    locations,
    handleAddLocation,
    handleDeleteLocation,
    handleToggleLocationStatus
  };
};
