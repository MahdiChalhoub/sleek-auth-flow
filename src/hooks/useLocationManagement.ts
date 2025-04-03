
import { useState, useEffect, useCallback } from 'react';
import { Branch } from '@/types/location';
import { fromTable, isDataResponse } from '@/utils/supabaseServiceHelper';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useLocationManagement = () => {
  const [locations, setLocations] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentBusiness } = useAuth();

  const fetchLocations = useCallback(async () => {
    if (!currentBusiness) return;
    
    setLoading(true);
    try {
      const response = await fromTable('branches')
        .select('*')
        .eq('business_id', currentBusiness.id);
      
      if (!isDataResponse(response)) {
        console.error('Error fetching locations:', response.error);
        return;
      }
      
      const fetchedLocations: Branch[] = [];
      
      if (Array.isArray(response.data)) {
        for (const itemData of response.data) {
          if (!itemData) continue;
          
          // Type safely process location data
          const typedItemData = itemData as Record<string, unknown>;
          
          const location: Branch = {
            id: String(typedItemData.id || ''),
            name: String(typedItemData.name || ''),
            address: typedItemData.address ? String(typedItemData.address) : undefined,
            phone: typedItemData.phone ? String(typedItemData.phone) : undefined,
            email: typedItemData.email ? String(typedItemData.email) : undefined,
            businessId: String(typedItemData.business_id || ''),
            status: typedItemData.status ? String(typedItemData.status) : undefined,
            type: typedItemData.type ? String(typedItemData.type) : undefined,
            isDefault: typedItemData.is_default ? Boolean(typedItemData.is_default) : false,
            locationCode: typedItemData.location_code ? String(typedItemData.location_code) : undefined,
            createdAt: typedItemData.created_at ? String(typedItemData.created_at) : undefined,
            updatedAt: typedItemData.updated_at ? String(typedItemData.updated_at) : undefined,
            openingHours: typedItemData.opening_hours ? String(typedItemData.opening_hours) : undefined,
          };
          
          fetchedLocations.push(location);
        }
      }
      
      setLocations(fetchedLocations);
    } catch (error) {
      console.error('Error in fetchLocations:', error);
      toast.error('Failed to load locations');
    } finally {
      setLoading(false);
    }
  }, [currentBusiness]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const createLocation = async (locationData: Partial<Branch>): Promise<Branch | null> => {
    if (!currentBusiness) {
      toast.error('Business must be selected to create a location');
      return null;
    }
    
    setLoading(true);
    try {
      const { data, error } = await fromTable('branches')
        .insert({
          ...locationData,
          business_id: currentBusiness.id,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const newLocation: Branch = {
        id: data.id,
        name: data.name,
        businessId: data.business_id,
        ...locationData,
      };
      
      setLocations(prev => [...prev, newLocation]);
      
      toast.success('Location created successfully');
      return newLocation;
    } catch (error: any) {
      console.error('Error creating location:', error.message);
      toast.error('Failed to create location');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    locations,
    loading,
    fetchLocations,
    createLocation,
  };
};
