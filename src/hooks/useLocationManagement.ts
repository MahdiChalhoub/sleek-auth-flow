
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Branch } from '@/types/location';
import { useAuth } from '@/contexts/AuthContext';
import { fromTable, isDataResponse } from '@/utils/supabaseServiceHelper';

export const useLocationManagement = () => {
  const [locations, setLocations] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentBusiness } = useAuth();

  const fetchLocations = useCallback(async () => {
    if (!currentBusiness?.id) return;
    
    try {
      setIsLoading(true);
      
      const response = await fromTable('locations')
        .select('*')
        .eq('business_id', currentBusiness.id)
        .order('created_at', { ascending: false });
      
      if (!isDataResponse(response)) {
        throw new Error(response.error?.message || 'Failed to load locations');
      }
      
      // Type guard to ensure data is available
      const locationsData = response.data || [];
      
      const mappedLocations: Branch[] = locationsData.map(location => {
        // Make sure location is not null before accessing properties
        if (!location) return null;
        
        return {
          id: location?.id || '',
          name: location?.name || '',
          address: location?.address || '',
          phone: location?.phone || '',
          email: location?.email || '',
          businessId: location?.business_id || '',
          status: (location?.status as 'active' | 'inactive' | 'pending') || 'active',
          type: (location?.type as 'retail' | 'warehouse' | 'office' | 'other') || 'retail',
          isDefault: location?.is_default || false,
          locationCode: location?.location_code || '',
          createdAt: location?.created_at || '',
          updatedAt: location?.updated_at || '',
          openingHours: location?.opening_hours || {}
        };
      }).filter(Boolean) as Branch[]; // Filter out null values
      
      setLocations(mappedLocations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to load locations');
    } finally {
      setIsLoading(false);
    }
  }, [currentBusiness?.id]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleAddLocation = useCallback(async (newLocation: Branch) => {
    if (!currentBusiness?.id) {
      toast.error('No business selected');
      return;
    }
    
    try {
      const response = await fromTable('locations')
        .insert({
          name: newLocation.name,
          business_id: currentBusiness.id,
          address: newLocation.address,
          phone: newLocation.phone,
          email: newLocation.email,
          type: newLocation.type,
          status: newLocation.status || 'active',
          is_default: newLocation.isDefault || false,
          location_code: newLocation.locationCode,
          opening_hours: newLocation.openingHours || {}
        })
        .select()
        .single();
      
      if (!isDataResponse(response)) {
        throw new Error(response.error?.message || 'Failed to add location');
      }
      
      toast.success('Location added successfully');
      fetchLocations();
    } catch (error) {
      console.error('Error adding location:', error);
      toast.error('Failed to add location');
    }
  }, [currentBusiness?.id, fetchLocations]);

  const handleDeleteLocation = useCallback(async (locationId: string) => {
    try {
      const response = await fromTable('locations')
        .delete()
        .eq('id', locationId);
      
      if (!isDataResponse(response)) {
        throw new Error(response.error?.message || 'Failed to delete location');
      }
      
      setLocations(prev => prev.filter(loc => loc.id !== locationId));
      toast.success('Location deleted successfully');
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('Failed to delete location');
    }
  }, []);

  const handleToggleLocationStatus = useCallback(async (locationId: string, isActive: boolean) => {
    try {
      const newStatus = isActive ? 'active' : 'inactive';
      
      const response = await fromTable('locations')
        .update({ status: newStatus })
        .eq('id', locationId);
      
      if (!isDataResponse(response)) {
        throw new Error(response.error?.message || 'Failed to update location status');
      }
      
      setLocations(prev => 
        prev.map(loc => 
          loc.id === locationId 
            ? { ...loc, status: newStatus as 'active' | 'inactive' | 'pending' } 
            : loc
        )
      );
      
      toast.success(`Location ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling location status:', error);
      toast.error('Failed to update location status');
    }
  }, []);

  return {
    locations,
    isLoading,
    handleAddLocation,
    handleDeleteLocation,
    handleToggleLocationStatus,
    refreshLocations: fetchLocations
  };
};
