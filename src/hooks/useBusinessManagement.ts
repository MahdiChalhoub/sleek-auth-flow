import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Business } from '@/models/interfaces/businessInterfaces';
import { useAuth } from '@/contexts/AuthContext';
import { fromTable, isDataResponse } from '@/utils/supabaseServiceHelper';

export const useBusinessManagement = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchBusinesses = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      const response = await fromTable('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (!isDataResponse(response)) {
        throw new Error(response.error?.message || 'Failed to load businesses');
      }

      // Type guard to ensure data is available
      const businessesData = response.data || [];

      const mappedBusinesses: Business[] = businessesData.map(business => {
        // Make sure business is not null before accessing properties
        if (!business) return null;

        return {
          id: business?.id || '',
          name: business?.name || '',
          address: business?.address || '',
          phone: business?.phone || '',
          email: business?.email || '',
          status: (business?.status as 'active' | 'inactive' | 'pending') || 'active',
          ownerId: business?.owner_id || '',
          createdAt: business?.created_at || '',
          updatedAt: business?.updated_at || '',
          logoUrl: business?.logo_url || '',
          description: business?.description || '',
          type: business?.type || '',
          country: business?.country || '',
          currency: business?.currency || '',
          active: business?.active || false,
          timezone: business?.timezone || ''
        };
      }).filter(Boolean) as Business[]; // Filter out null values

      setBusinesses(mappedBusinesses);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      toast.error('Failed to load businesses');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const handleAddBusiness = useCallback(async (newBusiness: Business) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const response = await fromTable('businesses')
        .insert({
          name: newBusiness.name,
          address: newBusiness.address,
          phone: newBusiness.phone,
          email: newBusiness.email,
          status: newBusiness.status || 'active',
          owner_id: user.id,
          logo_url: newBusiness.logoUrl,
          description: newBusiness.description,
          type: newBusiness.type,
          country: newBusiness.country,
          currency: newBusiness.currency,
          active: newBusiness.active || false,
          timezone: newBusiness.timezone
        })
        .select()
        .single();

      if (!isDataResponse(response)) {
        throw new Error(response.error?.message || 'Failed to add business');
      }

      toast.success('Business added successfully');
      fetchBusinesses();
    } catch (error) {
      console.error('Error adding business:', error);
      toast.error('Failed to add business');
    }
  }, [user?.id, fetchBusinesses]);

  const handleDeleteBusiness = useCallback(async (businessId: string) => {
    try {
      const response = await fromTable('businesses')
        .delete()
        .eq('id', businessId);

      if (!isDataResponse(response)) {
        throw new Error(response.error?.message || 'Failed to delete business');
      }

      setBusinesses(prev => prev.filter(business => business.id !== businessId));
      toast.success('Business deleted successfully');
    } catch (error) {
      console.error('Error deleting business:', error);
      toast.error('Failed to delete business');
    }
  }, []);

  const handleToggleBusinessStatus = useCallback(async (businessId: string, isActive: boolean) => {
    try {
      const newStatus = isActive ? 'active' : 'inactive';

      const response = await fromTable('businesses')
        .update({ status: newStatus })
        .eq('id', businessId);

      if (!isDataResponse(response)) {
        throw new Error(response.error?.message || 'Failed to update business status');
      }

      setBusinesses(prev =>
        prev.map(business =>
          business.id === businessId
            ? { ...business, status: newStatus as 'active' | 'inactive' | 'pending' }
            : business
        )
      );

      toast.success(`Business ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling business status:', error);
      toast.error('Failed to update business status');
    }
  }, []);

// Replace the problematic code with null-safe code
export function safeBusinessTransform<T>(
  data: T[] | null | undefined,
  transformer: (item: T) => any
): any[] {
  if (!data) return [];
  
  return data
    .map(item => (item !== null ? transformer(item) : null))
    .filter(item => item !== null);
}

  return {
    businesses,
    isLoading,
    handleAddBusiness,
    handleDeleteBusiness,
    handleToggleBusinessStatus,
    refreshBusinesses: fetchBusinesses
  };
};
