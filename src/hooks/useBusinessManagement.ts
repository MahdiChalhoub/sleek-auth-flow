
import { useState, useEffect, useCallback } from 'react';
import { Business } from '@/models/interfaces/businessInterfaces';
import { fromTable, isDataResponse } from '@/utils/supabaseServiceHelper';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useBusinessManagement = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchBusinesses = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fromTable('businesses')
        .select('*')
        .eq('owner_id', user.id);
      
      if (!isDataResponse(response)) {
        console.error('Error fetching businesses:', response.error);
        return;
      }
      
      const fetchedBusinesses: Business[] = [];
      
      if (Array.isArray(response.data)) {
        for (const itemData of response.data) {
          if (!itemData) continue;
          
          // Type safely process business data
          const typedItemData = itemData as Record<string, unknown>;
          
          const business: Business = {
            id: String(typedItemData.id || ''),
            name: String(typedItemData.name || ''),
            address: typedItemData.address ? String(typedItemData.address) : undefined,
            phone: typedItemData.phone ? String(typedItemData.phone) : undefined,
            email: typedItemData.email ? String(typedItemData.email) : undefined,
            status: String(typedItemData.status || 'inactive'),
            ownerId: String(typedItemData.owner_id || ''),
            createdAt: typedItemData.created_at ? String(typedItemData.created_at) : undefined,
            updatedAt: typedItemData.updated_at ? String(typedItemData.updated_at) : undefined,
            logoUrl: typedItemData.logo_url ? String(typedItemData.logo_url) : undefined,
            description: typedItemData.description ? String(typedItemData.description) : undefined,
            type: typedItemData.type ? String(typedItemData.type) : undefined,
            country: typedItemData.country ? String(typedItemData.country) : undefined,
            currency: typedItemData.currency ? String(typedItemData.currency) : undefined,
            active: typedItemData.active ? Boolean(typedItemData.active) : undefined,
            timezone: typedItemData.timezone ? String(typedItemData.timezone) : undefined,
          };
          
          fetchedBusinesses.push(business);
        }
      }
      
      setBusinesses(fetchedBusinesses);
    } catch (error) {
      console.error('Error in fetchBusinesses:', error);
      toast.error('Failed to load businesses');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const createBusiness = async (businessData: Partial<Business>): Promise<Business | null> => {
    if (!user) {
      toast.error('User must be logged in to create a business');
      return null;
    }
    
    setLoading(true);
    try {
      const { data, error } = await fromTable('businesses')
        .insert({
          ...businessData,
          owner_id: user.id,
          status: 'active',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const newBusiness: Business = {
        id: data.id,
        name: data.name,
        status: data.status,
        ownerId: data.owner_id,
        ...businessData,
      };
      
      setBusinesses(prev => [...prev, newBusiness]);
      
      toast.success('Business created successfully');
      return newBusiness;
    } catch (error: any) {
      console.error('Error creating business:', error.message);
      toast.error('Failed to create business');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    businesses,
    loading,
    fetchBusinesses,
    createBusiness,
  };
};
