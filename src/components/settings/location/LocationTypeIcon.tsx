
import React from "react";
import { Building, MapPin } from "lucide-react";

interface LocationTypeIconProps {
  type: string;
}

export const LocationTypeIcon: React.FC<LocationTypeIconProps> = ({ type }) => {
  switch (type) {
    case "store":
      return <Building className="h-4 w-4 text-primary" />;
    case "warehouse":
      return <Building className="h-4 w-4 text-violet-500" />;
    case "pickup":
      return <MapPin className="h-4 w-4 text-amber-500" />;
    default:
      return <Building className="h-4 w-4" />;
  }
};
