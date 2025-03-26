
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
  
  // State for dropdown menus
  const [isBusinessDialogOpen, setIsBusinessDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Synchronization flag to prevent rapid state changes
  const pendingUpdatesRef = useRef<Array<() => void>>([]);
  const isProcessingRef = useRef(false);
  
  // Process pending state updates one at a time
  const processNextUpdate = () => {
    if (pendingUpdatesRef.current.length === 0) {
      isProcessingRef.current = false;
      return;
    }
    
    isProcessingRef.current = true;
    const nextUpdate = pendingUpdatesRef.current.shift();
    
    if (nextUpdate) {
      nextUpdate();
      // Wait a bit before processing the next update to avoid flickering
      setTimeout(processNextUpdate, 50);
    } else {
      isProcessingRef.current = false;
    }
  };
  
  // Queue a state update
  const queueStateUpdate = (updateFn: () => void) => {
    pendingUpdatesRef.current.push(updateFn);
    
    if (!isProcessingRef.current) {
      processNextUpdate();
    }
  };
  
  // Close all other dropdowns when one is opened
  const closeAllExcept = (keepOpen: string) => {
    queueStateUpdate(() => {
      if (keepOpen !== 'business' && isBusinessDialogOpen) setIsBusinessDialogOpen(false);
      if (keepOpen !== 'location' && isLocationDialogOpen) setIsLocationDialogOpen(false);
      if (keepOpen !== 'notifications' && isNotificationsOpen) setIsNotificationsOpen(false);
      if (keepOpen !== 'user' && isUserMenuOpen) setIsUserMenuOpen(false);
    });
  };
  
  // Handlers for each dropdown
  const handleBusinessDialogChange = (open: boolean) => {
    if (open) closeAllExcept('business');
    queueStateUpdate(() => setIsBusinessDialogOpen(open));
  };
  
  const handleLocationDialogChange = (open: boolean) => {
    if (open) closeAllExcept('location');
    queueStateUpdate(() => setIsLocationDialogOpen(open));
  };
  
  const handleNotificationsChange = (open: boolean) => {
    if (open) closeAllExcept('notifications');
    queueStateUpdate(() => setIsNotificationsOpen(open));
  };
  
  const handleUserMenuChange = (open: boolean) => {
    if (open) closeAllExcept('user');
    queueStateUpdate(() => setIsUserMenuOpen(open));
  };
  
  // Clean up any pending timeouts
  useEffect(() => {
    return () => {
      isProcessingRef.current = false;
      pendingUpdatesRef.current = [];
    };
  }, []);
  
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
        
        <NotificationsMenu />
        
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
