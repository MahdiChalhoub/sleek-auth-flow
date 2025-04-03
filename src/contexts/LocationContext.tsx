
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  businessId: string;
  status: 'active' | 'inactive' | 'pending' | 'closed'; 
  type: 'retail' | 'warehouse' | 'office' | 'other';
  isDefault: boolean;
  locationCode: string;
  createdAt: string;
  updatedAt: string;
  openingHours?: string;
}

interface LocationContextType {
  currentLocation: Location | null;
  availableLocations: Location[];
  isLoadingLocations: boolean;
  switchLocation: (locationId: string) => void;
  userHasAccessToLocation: (locationId: string) => boolean;
}

const LocationContext = createContext<LocationContextType>({
  currentLocation: null,
  availableLocations: [],
  isLoadingLocations: true,
  switchLocation: () => {},
  userHasAccessToLocation: () => false
});

export const useLocationContext = () => useContext(LocationContext);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, currentBusiness, isLoading } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [availableLocations, setAvailableLocations] = useState<Location[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  const mapDatabaseLocationToLocation = (dbLocation: any): Location => {
    return {
      id: dbLocation.id,
      name: dbLocation.name,
      address: dbLocation.address || '',
      phone: dbLocation.phone || '',
      email: dbLocation.email || '',
      businessId: dbLocation.business_id,
      status: dbLocation.status || 'active',
      type: dbLocation.type || 'retail',
      isDefault: !!dbLocation.is_default,
      locationCode: dbLocation.location_code || '',
      createdAt: dbLocation.created_at,
      updatedAt: dbLocation.updated_at,
      openingHours: dbLocation.opening_hours
    };
  };

  useEffect(() => {
    const fetchLocations = async () => {
      if (!currentBusiness || !user) {
        setAvailableLocations([]);
        setCurrentLocation(null);
        setIsLoadingLocations(false);
        return;
      }

      try {
        setIsLoadingLocations(true);
        
        const { data, error } = await supabase
          .from('locations')
          .select('*')
          .eq('business_id', currentBusiness.id);
        
        if (error) {
          console.error('Error fetching locations:', error);
          throw error;
        }
        
        const locations = (data || []).map(mapDatabaseLocationToLocation);
        
        setAvailableLocations(locations);
        
        // Handle current location
        const savedLocationId = localStorage.getItem('pos_current_location');
        
        if (savedLocationId) {
          const savedLocation = locations.find(loc => loc.id === savedLocationId);
          if (savedLocation) {
            setCurrentLocation(savedLocation);
          } else if (locations.length > 0) {
            // Fallback to default location or first available
            const defaultLocation = locations.find(loc => loc.isDefault) || locations[0];
            setCurrentLocation(defaultLocation);
            localStorage.setItem('pos_current_location', defaultLocation.id);
          }
        } else if (locations.length > 0) {
          // No saved location, use default or first
          const defaultLocation = locations.find(loc => loc.isDefault) || locations[0];
          setCurrentLocation(defaultLocation);
          localStorage.setItem('pos_current_location', defaultLocation.id);
        }
        
      } catch (error) {
        console.error('Error fetching locations:', error);
        toast.error('Failed to load locations');
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, [currentBusiness, user]);

  const switchLocation = (locationId: string) => {
    const location = availableLocations.find(loc => loc.id === locationId);
    if (location) {
      setCurrentLocation(location);
      localStorage.setItem('pos_current_location', location.id);
      toast.success(`Switched to ${location.name}`);
    } else {
      toast.error('Location not found');
    }
  };

  const userHasAccessToLocation = (locationId: string): boolean => {
    // For now, assume all locations in the business are accessible
    // This can be enhanced with permission checks later
    return availableLocations.some(loc => loc.id === locationId);
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        availableLocations,
        isLoadingLocations,
        switchLocation,
        userHasAccessToLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
