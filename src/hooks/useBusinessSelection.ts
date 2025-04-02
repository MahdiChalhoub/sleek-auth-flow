
import { useState, useCallback } from 'react';
import { Business } from '@/models/interfaces/businessInterfaces';
import { User } from '@/types/auth';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

// Mock businesses for development
const initialBusinesses: Business[] = [
  {
    id: 'business-1',
    name: 'Main Business',
    status: 'active',
    ownerId: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    email: 'info@mainbusiness.com',
    phone: '555-123-4567',
    address: '123 Main St, New York, NY',
    active: true,
    description: 'Main retail store'
  },
  {
    id: 'business-2',
    name: 'Secondary Business',
    status: 'active',
    ownerId: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    email: 'info@secondarybusiness.com',
    phone: '555-987-6543',
    address: '456 Second Ave, Chicago, IL',
    active: true,
    description: 'Wholesale distribution center'
  }
];

export const useBusinessSelection = (user: User | null) => {
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [userBusinesses, setUserBusinesses] = useState<Business[]>([]);
  
  // Instead of mockBusinesses, in a real implementation, this would fetch from Supabase
  const initializeBusinessSelection = useCallback(async (currentUser: User | null, businessId?: string) => {
    if (!currentUser) {
      setCurrentBusiness(null);
      setUserBusinesses([]);
      return;
    }
    
    try {
      // For now, we'll use the mock data, but in a full implementation
      // we would fetch this from Supabase based on the user's access
      const availableBusinesses = initialBusinesses;
      
      setUserBusinesses(availableBusinesses);
      
      if (businessId) {
        const selectedBusiness = availableBusinesses.find(b => b.id === businessId);
        if (selectedBusiness) {
          setCurrentBusiness(selectedBusiness);
          localStorage.setItem("pos_current_business", selectedBusiness.id);
        } else if (availableBusinesses.length > 0) {
          // Set the first available business if the requested one doesn't exist
          setCurrentBusiness(availableBusinesses[0]);
          localStorage.setItem("pos_current_business", availableBusinesses[0].id);
        }
      } else if (availableBusinesses.length > 0) {
        // Set the first business as default
        setCurrentBusiness(availableBusinesses[0]);
        localStorage.setItem("pos_current_business", availableBusinesses[0].id);
      }
    } catch (error) {
      console.error("Error initializing business selection:", error);
      toast.error("Failed to load businesses", {
        description: "Please try again or contact support."
      });
    }
  }, []);
  
  const switchBusiness = useCallback((businessId: string) => {
    const business = userBusinesses.find(b => b.id === businessId);
    if (business) {
      setCurrentBusiness(business);
      localStorage.setItem("pos_current_business", business.id);
      toast.success(`Switched to ${business.name}`, {
        description: "All data will now reflect this business."
      });
    } else {
      toast.error("Business not found", {
        description: "The selected business is not available."
      });
    }
  }, [userBusinesses]);
  
  return {
    currentBusiness,
    userBusinesses,
    initializeBusinessSelection,
    switchBusiness
  };
};
