
import { useState } from 'react';
import { Branch, mockBranches } from '@/models/interfaces/businessInterfaces';

export function useLocationManagement(businessId?: string) {
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
  
  const handleAddLocation = (location: Branch) => {
    addLocation(location);
  };
  
  const handleDeleteLocation = (id: string) => {
    deleteLocation(id);
  };
  
  const handleToggleLocationStatus = (id: string) => {
    const location = getLocationById(id);
    if (location) {
      updateLocation(id, { status: location.status === 'active' ? 'inactive' : 'active' });
    }
  };
  
  return {
    locations,
    addLocation,
    updateLocation,
    deleteLocation,
    getLocationById,
    getActiveLocations,
    handleAddLocation,
    handleDeleteLocation,
    handleToggleLocationStatus
  };
}
