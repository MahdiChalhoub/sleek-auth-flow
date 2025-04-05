import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Business } from '@/models/interfaces/businessInterfaces';
import { toast } from 'sonner';

export const useBusinessManagement = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      if (data) {
        const mappedBusinesses: Business[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          address: item.address || '',
          phone: item.phone || '',
          email: item.email || '',
          status: item.status,
          ownerId: item.owner_id,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          logoUrl: item.logo_url,
          description: item.description || '',
          type: item.type,
          country: item.country || '',
          currency: item.currency,
          active: item.active,
          timezone: item.timezone || 'UTC'
        }));
        
        setBusinesses(mappedBusinesses);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      toast.error('Failed to load businesses');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBusiness = async (businessData: Partial<Business>): Promise<Business> => {
    const dbBusinessData = {
      name: businessData.name,
      address: businessData.address,
      phone: businessData.phone,
      email: businessData.email,
      status: businessData.status || 'active',
      owner_id: businessData.ownerId,
      logo_url: businessData.logoUrl,
      description: businessData.description,
      type: businessData.type,
      country: businessData.country,
      currency: businessData.currency,
      active: businessData.active !== undefined ? businessData.active : true,
      timezone: businessData.timezone
    };

    const { data, error } = await supabase
      .from('businesses')
      .insert(dbBusinessData)
      .select()
      .single();

    if (error) throw error;
    
    const newBusiness: Business = {
      id: data.id,
      name: data.name,
      status: data.status,
      ownerId: data.owner_id,
      address: data.address,
      phone: data.phone,
      email: data.email,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      logoUrl: data.logo_url,
      description: data.description,
      type: data.type,
      country: data.country,
      currency: data.currency,
      active: data.active,
      timezone: data.timezone
    };

    await fetchBusinesses();
    return newBusiness;
  };

  const deleteBusiness = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchBusinesses();
  };

  const toggleBusinessStatus = async (id: string, active: boolean): Promise<void> => {
    const { error } = await supabase
      .from('businesses')
      .update({ active })
      .eq('id', id);

    if (error) throw error;
    await fetchBusinesses();
  };

  return {
    businesses,
    isLoading: loading,
    fetchBusinesses,
    handleAddBusiness: createBusiness,
    handleDeleteBusiness: deleteBusiness,
    handleToggleBusinessStatus: toggleBusinessStatus,
    refreshBusinesses: fetchBusinesses
  };
};
