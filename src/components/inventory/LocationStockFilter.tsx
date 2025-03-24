
import React from "react";
import { Label } from "@/components/ui/label";
import { useLocationContext } from "@/contexts/LocationContext";
import { MapPin } from "lucide-react";

interface LocationStockFilterProps {
  onSelectLocation: (locationId: string | null) => void;
  selectedLocationId: string | null;
}

const LocationStockFilter: React.FC<LocationStockFilterProps> = ({
  onSelectLocation,
  selectedLocationId
}) => {
  const { availableLocations, currentLocation } = useLocationContext();
  
  return (
    <div className="flex flex-col md:flex-row gap-2 items-center">
      <div className="flex items-center gap-2">
        <MapPin size={16} className="text-blue-600" />
        <Label>Location:</Label>
      </div>
      <select 
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        value={selectedLocationId || (currentLocation ? currentLocation.id : "")}
        onChange={(e) => onSelectLocation(e.target.value !== "all" ? e.target.value : null)}
      >
        <option value="all">All Locations</option>
        {availableLocations.map(location => (
          <option key={location.id} value={location.id}>
            {location.name} {location.id === currentLocation?.id ? "(Current)" : ""}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationStockFilter;
