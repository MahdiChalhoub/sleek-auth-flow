
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Branch } from '@/types/location';
import { useAuth } from './AuthContext';

interface LocationContextType {
  currentLocation: Branch | null;
  availableLocations: Branch[];
  isLoading: boolean;
  switchLocation: (locationId: string) => void;
  refreshLocations: () => Promise<void>;
  userHasAccessToLocation: (locationId: string) => boolean;
}

const LocationContext = createContext<LocationContextType>({
  currentLocation: null,
  availableLocations: [],
  isLoading: true,
  switchLocation: () => {},
  refreshLocations: async () => {},
  userHasAccessToLocation: () => false,
});

export const useLocationContext = () => useContext(LocationContext);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<Branch | null>(null);
  const [availableLocations, setAvailableLocations] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, currentBusiness } = useAuth();

  const refreshLocations = useCallback(async () => {
    if (!currentBusiness?.id || !user) {
      setAvailableLocations([]);
      setCurrentLocation(null);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch locations from Supabase
      const { data: locations, error } = await supabase
        .from('locations')
        .select('*')
        .eq('business_id', currentBusiness.id)
        .eq('status', 'active');
      
      if (error) throw error;
      
      // Map database locations to our Branch type
      const mappedLocations: Branch[] = locations.map(location => ({
        id: location.id,
        name: location.name,
        address: location.address || '',
        phone: location.phone || '',
        email: location.email || '',
        businessId: location.business_id,
        status: location.status || 'active',
        type: location.type || 'retail',
        isDefault: location.is_default || false,
        locationCode: location.location_code || '',
        createdAt: location.created_at,
        updatedAt: location.updated_at,
        openingHours: location.opening_hours || {}
      }));
      
      setAvailableLocations(mappedLocations);
      
      // Set current location
      const savedLocationId = localStorage.getItem('pos_current_location');
      
      if (savedLocationId) {
        const savedLocation = mappedLocations.find(loc => loc.id === savedLocationId);
        if (savedLocation) {
          setCurrentLocation(savedLocation);
        } else if (mappedLocations.length > 0) {
          // If saved location not found, use the first available
          setCurrentLocation(mappedLocations[0]);
          localStorage.setItem('pos_current_location', mappedLocations[0].id);
        }
      } else if (mappedLocations.length > 0) {
        // Find default location or use first one
        const defaultLocation = mappedLocations.find(loc => loc.isDefault) || mappedLocations[0];
        setCurrentLocation(defaultLocation);
        localStorage.setItem('pos_current_location', defaultLocation.id);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to load locations');
    } finally {
      setIsLoading(false);
    }
  }, [currentBusiness?.id, user]);

  useEffect(() => {
    refreshLocations();
  }, [refreshLocations]);

  const switchLocation = useCallback((locationId: string) => {
    const location = availableLocations.find(loc => loc.id === locationId);
    if (location) {
      setCurrentLocation(location);
      localStorage.setItem('pos_current_location', location.id);
      toast.success(`Switched to ${location.name}`);
    }
  }, [availableLocations]);

  const userHasAccessToLocation = useCallback((locationId: string) => {
    // For now, assume users have access to all locations
    // This can be enhanced later with proper permission checks
    return !!availableLocations.find(loc => loc.id === locationId);
  }, [availableLocations]);

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        availableLocations,
        isLoading,
        switchLocation,
        refreshLocations,
        userHasAccessToLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
