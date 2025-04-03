
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider'; // Ensure this path is correct
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
  console.log('🏙️ LocationProvider rendering');
  
  // Try to access auth context, but don't throw if it's not available
  let auth;
  try {
    auth = useAuth();
    console.log('🏙️ Auth context accessed successfully in LocationProvider');
  } catch (error) {
    console.error('Auth context not available in LocationProvider:', error);
    // Return a basic provider that won't attempt to use auth functionality
    return (
      <LocationContext.Provider
        value={{
          currentLocation: null,
          availableLocations: [],
          isLoadingLocations: false,
          switchLocation: () => {
            console.warn('Location switching not available: Auth context missing');
          },
          userHasAccessToLocation: () => false
        }}
      >
        {children}
      </LocationContext.Provider>
    );
  }
  
  const { user, currentBusiness, isLoading } = auth;
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
    console.log('🏙️ LocationProvider useEffect triggered', { 
      hasBusiness: !!currentBusiness, 
      hasUser: !!user, 
      isLoading 
    });
    
    const fetchLocations = async () => {
      if (!currentBusiness || !user) {
        console.log('🏙️ No business or user, skipping location fetch');
        setAvailableLocations([]);
        setCurrentLocation(null);
        setIsLoadingLocations(false);
        return;
      }

      try {
        setIsLoadingLocations(true);
        console.log('🏙️ Fetching locations for business:', currentBusiness.id);
        
        const { data, error } = await supabase
          .from('locations')
          .select('*')
          .eq('business_id', currentBusiness.id);
        
        if (error) {
          console.error('Error fetching locations:', error);
          throw error;
        }
        
        console.log('🏙️ Locations fetched:', data?.length || 0);
        const locations = (data || []).map(mapDatabaseLocationToLocation);
        
        setAvailableLocations(locations);
        
        // Handle current location
        const savedLocationId = localStorage.getItem('pos_current_location');
        
        if (savedLocationId) {
          const savedLocation = locations.find(loc => loc.id === savedLocationId);
          if (savedLocation) {
            setCurrentLocation(savedLocation);
            console.log('🏙️ Restored saved location:', savedLocation.name);
          } else if (locations.length > 0) {
            // Fallback to default location or first available
            const defaultLocation = locations.find(loc => loc.isDefault) || locations[0];
            setCurrentLocation(defaultLocation);
            localStorage.setItem('pos_current_location', defaultLocation.id);
            console.log('🏙️ Using default location:', defaultLocation.name);
          }
        } else if (locations.length > 0) {
          // No saved location, use default or first
          const defaultLocation = locations.find(loc => loc.isDefault) || locations[0];
          setCurrentLocation(defaultLocation);
          localStorage.setItem('pos_current_location', defaultLocation.id);
          console.log('🏙️ Using default location (no saved):', defaultLocation.name);
        }
        
      } catch (error) {
        console.error('Error fetching locations:', error);
        toast.error('Failed to load locations');
      } finally {
        setIsLoadingLocations(false);
      }
    };

    if (!isLoading) {
      fetchLocations();
    }
  }, [currentBusiness, user, isLoading]);

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

  console.log('🏙️ LocationProvider value', {
    hasCurrentLocation: !!currentLocation,
    locationCount: availableLocations.length,
    isLoadingLocations
  });

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
