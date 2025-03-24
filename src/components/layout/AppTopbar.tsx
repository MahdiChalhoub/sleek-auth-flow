
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
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
  const [isBusinessDialogOpen, setIsBusinessDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <PageTitle />
      
      <div className="flex items-center gap-4">
        {currentBusiness && currentLocation && (
          <div className="flex items-center gap-2">
            <LocationSelector 
              isOpen={isLocationDialogOpen} 
              onOpenChange={setIsLocationDialogOpen} 
            />

            <BusinessSelector 
              isOpen={isBusinessDialogOpen} 
              onOpenChange={setIsBusinessDialogOpen} 
            />
          </div>
        )}
        
        <NotificationsMenu 
          isOpen={isNotificationsOpen} 
          onOpenChange={setIsNotificationsOpen} 
        />
        
        <UserMenu 
          openBusinessDialog={() => setIsBusinessDialogOpen(true)}
          openLocationDialog={() => setIsLocationDialogOpen(true)}
        />
      </div>
    </header>
  );
};

export default AppTopbar;
