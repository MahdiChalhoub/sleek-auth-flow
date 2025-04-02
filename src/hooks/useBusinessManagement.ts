
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Business } from '@/models/interfaces/businessInterfaces';
import { useAuth } from '@/contexts/AuthContext';
import { fromTable } from '@/utils/supabaseServiceHelper';

export const useBusinessManagement = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchBusinesses = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      // Fetch businesses where user is the owner
      const { data: ownedBusinesses, error: ownedError } = await fromTable('businesses')
        .select('*')
        .eq('owner_id', user.id);
      
      if (ownedError) throw ownedError;
      
      // Fetch businesses where user is a member
      const { data: memberBusinesses, error: memberError } = await fromTable('business_users')
        .select('business:businesses(*)')
        .eq('user_id', user.id);
      
      if (memberError) throw memberError;
      
      // Combine and deduplicate businesses
      const memberBusinessesData = memberBusinesses
        // Use type assertion to safely access business property
        .map(item => (item as any).business)
        .filter(Boolean);
      
      const allBusinesses = [...(ownedBusinesses || []), ...memberBusinessesData];
      
      // Remove duplicates based on business ID
      const uniqueBusinesses = allBusinesses.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, [] as any[]);
      
      // Map to our Business interface
      const mappedBusinesses: Business[] = uniqueBusinesses.map(business => ({
        id: business.id,
        name: business.name,
        address: business.address,
        phone: business.phone,
        email: business.email,
        status: business.status,
        ownerId: business.owner_id,
        createdAt: business.created_at,
        updatedAt: business.updated_at,
        logoUrl: business.logo_url,
        description: business.description,
        type: business.type,
        country: business.country,
        currency: business.currency,
        active: business.active,
        timezone: business.timezone
      }));
      
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
      toast.error('User not found');
      return;
    }
    
    try {
      const { data, error } = await fromTable('businesses')
        .insert({
          name: newBusiness.name,
          owner_id: user.id,
          address: newBusiness.address,
          phone: newBusiness.phone,
          email: newBusiness.email,
          status: newBusiness.status || 'active',
          description: newBusiness.description,
          type: newBusiness.type,
          country: newBusiness.country,
          currency: newBusiness.currency,
          active: newBusiness.active !== undefined ? newBusiness.active : true,
          timezone: newBusiness.timezone
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Business added successfully');
      fetchBusinesses();
    } catch (error) {
      console.error('Error adding business:', error);
      toast.error('Failed to add business');
    }
  }, [user?.id, fetchBusinesses]);

  const handleDeleteBusiness = useCallback(async (businessId: string) => {
    try {
      const { error } = await fromTable('businesses')
        .delete()
        .eq('id', businessId);
      
      if (error) throw error;
      
      setBusinesses(prev => prev.filter(business => business.id !== businessId));
      toast.success('Business deleted successfully');
    } catch (error) {
      console.error('Error deleting business:', error);
      toast.error('Failed to delete business');
    }
  }, []);

  const handleToggleBusinessStatus = useCallback(async (businessId: string, isActive: boolean) => {
    try {
      const { error } = await fromTable('businesses')
        .update({ active: isActive })
        .eq('id', businessId);
      
      if (error) throw error;
      
      setBusinesses(prev => 
        prev.map(business => 
          business.id === businessId 
            ? { ...business, active: isActive } 
            : business
        )
      );
      
      toast.success(`Business ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling business status:', error);
      toast.error('Failed to update business status');
    }
  }, []);

  return {
    businesses,
    isLoading,
    handleAddBusiness,
    handleDeleteBusiness,
    handleToggleBusinessStatus,
    refreshBusinesses: fetchBusinesses
  };
};
