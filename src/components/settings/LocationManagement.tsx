
import React, { useState } from "react";
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MapPin } from "lucide-react";
import { AddLocationModal } from "./AddLocationModal";
import { LocationList } from "./location/LocationList";
import { useLocationManagement } from "@/hooks/useLocationManagement";

interface LocationManagementProps {
  businessId: string;
}

export const LocationManagement: React.FC<LocationManagementProps> = ({ businessId }) => {
  const {
    locations,
    handleAddLocation,
    handleDeleteLocation,
    handleToggleLocationStatus
  } = useLocationManagement(businessId);
  
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  
  return (
    <Card className="shadow-sm border-none">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Locations
            </CardTitle>
            <CardDescription>
              Manage locations for this business
            </CardDescription>
          </div>
          <Button 
            onClick={() => setIsAddLocationModalOpen(true)} 
            className="flex items-center gap-2"
            size="sm"
          >
            <PlusCircle className="h-4 w-4" />
            Add Location
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <LocationList 
          locations={locations}
          onDeleteLocation={handleDeleteLocation}
          onToggleLocationStatus={handleToggleLocationStatus}
        />
      </CardContent>
      
      <AddLocationModal 
        isOpen={isAddLocationModalOpen}
        onClose={() => setIsAddLocationModalOpen(false)}
        onSave={handleAddLocation}
      />
    </Card>
  );
};
