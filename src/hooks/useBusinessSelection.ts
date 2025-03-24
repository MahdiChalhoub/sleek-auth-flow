
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Business, mockBusinesses, mockUserBusinessAssignments } from "@/models/interfaces/businessInterfaces";
import { toast } from "sonner";
import { User } from "@/types/auth";

export const useBusinessSelection = (user: User | null) => {
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [userBusinesses, setUserBusinesses] = useState<Business[]>([]);
  const navigate = useNavigate();

  const loadUserBusinesses = useCallback((user: User) => {
    const userAssignments = mockUserBusinessAssignments.filter(
      assignment => assignment.userId === user.id
    );
    
    const businesses = mockBusinesses.filter(business => 
      userAssignments.some(assignment => assignment.businessId === business.id)
    );
    
    setUserBusinesses(businesses);
    return businesses;
  }, []);

  const initializeBusinessSelection = useCallback((user: User, savedBusinessId?: string) => {
    const businesses = loadUserBusinesses(user);
    
    if (savedBusinessId) {
      const business = businesses.find(b => b.id === savedBusinessId);
      if (business) {
        setCurrentBusiness(business);
        return;
      }
    }
    
    // If no saved business found or it's invalid, use the first one
    if (businesses.length > 0) {
      const defaultBusiness = businesses.find(b => 
        mockUserBusinessAssignments.some(a => 
          a.userId === user.id && 
          a.businessId === b.id && 
          a.isDefault
        )
      ) || businesses[0];
      
      setCurrentBusiness(defaultBusiness);
      localStorage.setItem("pos_current_business", defaultBusiness.id);
    }
  }, [loadUserBusinesses]);

  const switchBusiness = useCallback((businessId: string) => {
    if (!user || !user.isGlobalAdmin) {
      console.error("Only global admins can switch businesses");
      return;
    }
    
    const business = userBusinesses.find(b => b.id === businessId);
    
    if (!business) {
      console.error("Business not found");
      return;
    }
    
    setCurrentBusiness(business);
    localStorage.setItem("pos_current_business", business.id);
    
    toast.success(`Switched to ${business.name}`);
    
    // Redirect to home after switching
    navigate("/home");
  }, [user, userBusinesses, navigate]);

  return {
    currentBusiness,
    userBusinesses,
    loadUserBusinesses,
    initializeBusinessSelection,
    switchBusiness
  };
};
