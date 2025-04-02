
import { useState } from 'react';
import { Branch, mockBranches } from '@/models/interfaces/businessInterfaces';

export function useLocationManagement() {
  const [locations, setLocations] = useState<Branch[]>(mockBranches);
  
  const addLocation = (location: Branch) => {
    setLocations(prev => [...prev, location]);
  };
  
  const updateLocation = (id: string, updatedLocation: Partial<Branch>) => {
    setLocations(prev => 
      prev.map(loc => loc.id === id ? { ...loc, ...updatedLocation } : loc)
    );
  };
  
  const deleteLocation = (id: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== id));
  };
  
  const getLocationById = (id: string) => {
    return locations.find(loc => loc.id === id);
  };
  
  const getActiveLocations = () => {
    return locations.filter(loc => loc.status === 'active');
  };
  
  return {
    locations,
    addLocation,
    updateLocation,
    deleteLocation,
    getLocationById,
    getActiveLocations
  };
}
