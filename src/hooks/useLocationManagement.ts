
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Branch } from '@/types/location';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useLocationManagement = () => {
  const [locations, setLocations] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentBusiness } = useAuth();

  const fetchLocations = useCallback(async () => {
    if (!currentBusiness?.id) {
      console.warn('No current business selected');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('business_id', currentBusiness.id)
        .order('name');

      if (error) {
        throw error;
      }

      if (data) {
        const mappedLocations: Branch[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          address: item.address || '',
          phone: item.phone,
          email: item.email,
          businessId: item.business_id,
          status: item.status as "active" | "pending" | "inactive" | "closed",
          type: item.type as "retail" | "warehouse" | "office" | "other",
          isDefault: item.is_default,
          locationCode: item.location_code,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          openingHours: item.opening_hours
        }));
        
        setLocations(mappedLocations);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to load locations');
    } finally {
      setLoading(false);
    }
  }, [currentBusiness?.id]);

  const createLocation = async (locationData: Partial<Branch>): Promise<Branch> => {
    if (!currentBusiness?.id) {
      throw new Error('No current business selected');
    }

    // Map the locationData from frontend model to database schema
    const dbLocationData = {
      name: locationData.name,
      address: locationData.address || '',
      phone: locationData.phone,
      email: locationData.email,
      business_id: currentBusiness.id,
      status: locationData.status || 'active',
      type: locationData.type || 'retail',
      is_default: locationData.isDefault || false,
      location_code: locationData.locationCode,
      opening_hours: locationData.openingHours
    };

    const { data, error } = await supabase
      .from('locations')
      .insert(dbLocationData)
      .select()
      .single();

    if (error) throw error;
    
    // Map the response back to our frontend model
    const newLocation: Branch = {
      id: data.id,
      name: data.name,
      businessId: data.business_id,
      address: data.address || '',
      phone: data.phone,
      email: data.email,
      status: data.status as "active" | "pending" | "inactive" | "closed",
      type: data.type as "retail" | "warehouse" | "office" | "other",
      isDefault: data.is_default,
      locationCode: data.location_code,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      openingHours: data.opening_hours
    };

    await fetchLocations(); // Refresh the list
    return newLocation;
  };

  const deleteLocation = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchLocations(); // Refresh the list
  };

  const toggleLocationStatus = async (id: string, isActive: boolean): Promise<void> => {
    const status = isActive ? 'active' : 'inactive';
    
    const { error } = await supabase
      .from('locations')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    await fetchLocations(); // Refresh the list
  };

  return {
    locations,
    loading,
    fetchLocations,
    createLocation,
    handleAddLocation: createLocation,
    handleDeleteLocation: deleteLocation,
    handleToggleLocationStatus: toggleLocationStatus
  };
};
