
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocationContext } from "@/contexts/LocationContext";
import PageTitle from "./topbar/PageTitle";
import LocationSelector from "./topbar/LocationSelector";
import BusinessSelector from "./topbar/BusinessSelector";
import NotificationsMenu from "./topbar/NotificationsMenu";
import UserMenu from "./topbar/UserMenu";

const AppTopbar: React.FC = () => {
  const { currentBusiness } = useAuth();
  const { currentLocation } = useLocationContext();
  
  // Use separate state variables for each dropdown
  const [isBusinessDialogOpen, setIsBusinessDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Reference to track if a state change is already in progress
  const isChangingRef = useRef(false);
  const pendingChangeRef = useRef<null | { setter: Function, value: boolean }>(null);
  // Timeout reference for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Effect to handle pending changes
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // Helper function to safely update dropdown state
  const safelyUpdateState = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    value: boolean
  ) => {
    // If we're already in the process of changing state, queue this change
    if (isChangingRef.current) {
      pendingChangeRef.current = { setter, value };
      return;
    }
    
    // Mark that we're changing state
    isChangingRef.current = true;
    
    // Apply the state change
    setter(value);
    
    // Reset the changing flag after a short delay
    timeoutRef.current = setTimeout(() => {
      isChangingRef.current = false;
      
      // If there's a pending change, apply it
      if (pendingChangeRef.current) {
        const { setter: pendingSetter, value: pendingValue } = pendingChangeRef.current;
        pendingChangeRef.current = null;
        safelyUpdateState(pendingSetter as React.Dispatch<React.SetStateAction<boolean>>, pendingValue);
      }
    }, 50);
  };
  
  // Close all other dropdowns when one is opened
  const closeAllExcept = (keepOpen: string) => {
    if (keepOpen !== 'business') setIsBusinessDialogOpen(false);
    if (keepOpen !== 'location') setIsLocationDialogOpen(false);
    if (keepOpen !== 'notifications') setIsNotificationsOpen(false);
    if (keepOpen !== 'user') setIsUserMenuOpen(false);
  };
  
  // Specific handlers for each dropdown
  const handleBusinessDialogChange = (open: boolean) => {
    if (open) {
      closeAllExcept('business');
    }
    safelyUpdateState(setIsBusinessDialogOpen, open);
  };
  
  const handleLocationDialogChange = (open: boolean) => {
    if (open) {
      closeAllExcept('location');
    }
    safelyUpdateState(setIsLocationDialogOpen, open);
  };
  
  const handleNotificationsChange = (open: boolean) => {
    if (open) {
      closeAllExcept('notifications');
    }
    safelyUpdateState(setIsNotificationsOpen, open);
  };
  
  const handleUserMenuChange = (open: boolean) => {
    if (open) {
      closeAllExcept('user');
    }
    safelyUpdateState(setIsUserMenuOpen, open);
  };
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <PageTitle />
      
      <div className="flex items-center gap-4">
        {currentBusiness && currentLocation && (
          <div className="flex items-center gap-2">
            <LocationSelector 
              isOpen={isLocationDialogOpen} 
              onOpenChange={handleLocationDialogChange} 
            />

            <BusinessSelector 
              isOpen={isBusinessDialogOpen} 
              onOpenChange={handleBusinessDialogChange} 
            />
          </div>
        )}
        
        <NotificationsMenu 
          isOpen={isNotificationsOpen} 
          onOpenChange={handleNotificationsChange} 
        />
        
        <UserMenu 
          isOpen={isUserMenuOpen}
          onOpenChange={handleUserMenuChange}
          openBusinessDialog={() => handleBusinessDialogChange(true)}
          openLocationDialog={() => handleLocationDialogChange(true)}
        />
      </div>
    </header>
  );
};

export default AppTopbar;
