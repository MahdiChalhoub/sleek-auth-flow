
import { useState, useCallback } from 'react';
import { Branch } from '@/types/location';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { fromTable, isDataResponse } from '@/utils/supabaseServiceHelper';

export const useLocationManagement = () => {
  const [locations, setLocations] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentBusiness } = useAuth();
  
  const fetchLocations = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!currentBusiness) {
        setLocations([]);
        return;
      }
      
      const { data, error } = await fromTable('locations')
        .select('*')
        .eq('business_id', currentBusiness.id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Type assertion to ensure data is treated as an array of valid Branch objects
      const validData = (data || []) as unknown as Branch[];
      
      setLocations(validData);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentBusiness]);
  
  const createLocation = async (data: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      if (!currentBusiness) {
        throw new Error('No business selected');
      }

      const locationData = {
        ...data,
        business_id: currentBusiness?.id || '',
        opening_hours: typeof data.openingHours === 'object' 
          ? JSON.stringify(data.openingHours) 
          : data.openingHours
      };

      const { data: newLocation, error } = await fromTable('locations')
        .insert(locationData)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Type assertion to ensure safety
      const typedNewLocation = newLocation as unknown as Branch;
      
      setLocations(prev => [...prev, typedNewLocation]);
      toast.success('Location created successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateLocation = async (id: string, updates: Partial<Branch>) => {
    setIsLoading(true);
    try {
      const { data: updatedLocation, error } = await fromTable('locations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Type assertion for safety
      const typedUpdatedLocation = updatedLocation as unknown as Branch;
      
      setLocations(prev =>
        prev.map(location => (location.id === id ? typedUpdatedLocation : location))
      );
      toast.success('Location updated successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteLocation = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await fromTable('locations')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      setLocations(prev => prev.filter(location => location.id !== id));
      toast.success('Location deleted successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleLocationStatus = async (id: string, active: boolean) => {
    setIsLoading(true);
    try {
      const { error } = await fromTable('locations')
        .update({ is_active: active })
        .eq('id', id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      setLocations(prev =>
        prev.map(location =>
          location.id === id ? { ...location, is_active: active } : location
        )
      );
      toast.success('Location status updated successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    locations,
    isLoading,
    fetchLocations,
    createLocation,
    updateLocation,
    deleteLocation,
    toggleLocationStatus
  };
};
