
import { useState } from 'react';
import { Branch } from '@/types/location';

// Mock data for branches
const mockBranches: Branch[] = [
  {
    id: "branch-001",
    name: "Main Branch",
    address: "123 Main Street",
    phone: "+1234567890",
    status: "active"
  },
  {
    id: "branch-002",
    name: "Downtown Branch",
    address: "456 Downtown Avenue",
    phone: "+1234567891",
    status: "active"
  },
  {
    id: "branch-003",
    name: "Uptown Branch",
    address: "789 Uptown Boulevard",
    phone: "+1234567892",
    status: "inactive"
  }
];

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
    handleAddLocation,
    handleDeleteLocation,
    handleToggleLocationStatus
  };
}
