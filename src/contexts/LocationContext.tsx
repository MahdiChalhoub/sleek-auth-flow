
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Branch } from '@/types/location';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { fromTable, isDataResponse, safeDataTransform } from '@/utils/supabaseServiceHelper';

// Define the location context type
interface LocationContextType {
  currentLocation: Branch | null;
  availableLocations: Branch[];
  isLoadingLocations: boolean;
  switchLocation: (locationId: string) => void;
  userHasAccessToLocation: (locationId: string) => boolean;
  refreshLocations: () => Promise<void>;
}

// Create context with default values
const LocationContext = createContext<LocationContextType>({
  currentLocation: null,
  availableLocations: [],
  isLoadingLocations: true,
  switchLocation: () => {},
  userHasAccessToLocation: () => false,
  refreshLocations: async () => {}
});

// Export hook for using location context
export const useLocationContext = () => useContext(LocationContext);

// Location Provider component
export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<Branch | null>(null);
  const [availableLocations, setAvailableLocations] = useState<Branch[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const { currentBusiness, user } = useAuth();

  // Fetch locations for the current business
  const fetchLocations = useCallback(async () => {
    if (!currentBusiness?.id) {
      setAvailableLocations([]);
      setCurrentLocation(null);
      setIsLoadingLocations(false);
      return;
    }

    try {
      setIsLoadingLocations(true);
      
      const response = await fromTable('locations')
        .select('*')
        .eq('business_id', currentBusiness.id)
        .order('is_default', { ascending: false });
      
      if (!isDataResponse(response)) {
        throw new Error(response.error?.message || 'Failed to load locations');
      }

      // Use type assertion to map the locations safely
      const locationsData = response.data || [];
      
      const mappedLocations: Branch[] = safeDataTransform(locationsData, loc => ({
        id: loc.id || '',
        name: loc.name || '',
        address: loc.address || '',
        phone: loc.phone || '',
        email: loc.email || '',
        businessId: loc.business_id || '',
        status: (loc.status as 'active' | 'inactive' | 'pending') || 'active',
        type: (loc.type as 'retail' | 'warehouse' | 'office' | 'other') || 'retail',
        isDefault: loc.is_default || false,
        locationCode: loc.location_code || '',
        createdAt: loc.created_at || '',
        updatedAt: loc.updated_at || '',
        openingHours: loc.opening_hours || {}
      }));
      
      setAvailableLocations(mappedLocations);
      
      // Check if there's a saved location ID in localStorage
      const savedLocationId = localStorage.getItem("pos_current_location");
      
      if (savedLocationId) {
        const savedLocation = mappedLocations.find(loc => loc.id === savedLocationId);
        if (savedLocation) {
          setCurrentLocation(savedLocation);
        } else if (mappedLocations.length > 0) {
          // If saved location not found, use the default or first one
          const defaultLocation = mappedLocations.find(loc => loc.isDefault) || mappedLocations[0];
          setCurrentLocation(defaultLocation);
          localStorage.setItem("pos_current_location", defaultLocation.id);
        } else {
          setCurrentLocation(null);
          localStorage.removeItem("pos_current_location");
        }
      } else if (mappedLocations.length > 0) {
        // If no saved location, use the default or first one
        const defaultLocation = mappedLocations.find(loc => loc.isDefault) || mappedLocations[0];
        setCurrentLocation(defaultLocation);
        localStorage.setItem("pos_current_location", defaultLocation.id);
      } else {
        setCurrentLocation(null);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("Failed to load locations");
    } finally {
      setIsLoadingLocations(false);
    }
  }, [currentBusiness?.id]);

  // Fetch locations whenever currentBusiness changes
  useEffect(() => {
    fetchLocations();
  }, [fetchLocations, currentBusiness]);

  // Switch to a different location
  const switchLocation = (locationId: string) => {
    const newLocation = availableLocations.find(loc => loc.id === locationId);
    
    if (newLocation) {
      setCurrentLocation(newLocation);
      localStorage.setItem("pos_current_location", newLocation.id);
      toast.success(`Switched to ${newLocation.name}`);
    } else {
      toast.error("Location not found");
    }
  };

  // Check if user has access to a location (to be expanded with role-based checks)
  const userHasAccessToLocation = (locationId: string): boolean => {
    // For now, simply check if the location exists in available locations
    // This will be expanded with proper permission checking later
    return !!availableLocations.find(loc => loc.id === locationId);
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        availableLocations,
        isLoadingLocations,
        switchLocation,
        userHasAccessToLocation,
        refreshLocations: fetchLocations
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
