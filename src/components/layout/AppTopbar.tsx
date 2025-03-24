
import React, { useState } from "react";
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
  
  // Event handlers to prevent conflicts between different menus
  const handleBusinessDialogChange = (open: boolean) => {
    setIsBusinessDialogOpen(open);
    if (open) {
      setIsLocationDialogOpen(false);
      setIsNotificationsOpen(false);
      setIsUserMenuOpen(false);
    }
  };
  
  const handleLocationDialogChange = (open: boolean) => {
    setIsLocationDialogOpen(open);
    if (open) {
      setIsBusinessDialogOpen(false);
      setIsNotificationsOpen(false);
      setIsUserMenuOpen(false);
    }
  };
  
  const handleNotificationsChange = (open: boolean) => {
    setIsNotificationsOpen(open);
    if (open) {
      setIsBusinessDialogOpen(false);
      setIsLocationDialogOpen(false);
      setIsUserMenuOpen(false);
    }
  };
  
  const handleUserMenuChange = (open: boolean) => {
    setIsUserMenuOpen(open);
    if (open) {
      setIsBusinessDialogOpen(false);
      setIsLocationDialogOpen(false);
      setIsNotificationsOpen(false);
    }
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
