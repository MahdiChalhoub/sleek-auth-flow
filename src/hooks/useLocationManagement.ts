
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Branch } from '@/types/location';
import { useAuth } from '@/contexts/AuthContext';

export const useLocationManagement = () => {
  const [locations, setLocations] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentBusiness } = useAuth();

  const fetchLocations = useCallback(async () => {
    if (!currentBusiness?.id) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('business_id', currentBusiness.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const mappedLocations: Branch[] = data.map(location => ({
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
      const { data, error } = await supabase
        .from('locations')
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
      
      if (error) throw error;
      
      toast.success('Location added successfully');
      fetchLocations();
    } catch (error) {
      console.error('Error adding location:', error);
      toast.error('Failed to add location');
    }
  }, [currentBusiness?.id, fetchLocations]);

  const handleDeleteLocation = useCallback(async (locationId: string) => {
    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', locationId);
      
      if (error) throw error;
      
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
      
      const { error } = await supabase
        .from('locations')
        .update({ status: newStatus })
        .eq('id', locationId);
      
      if (error) throw error;
      
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
