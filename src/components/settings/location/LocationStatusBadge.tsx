
import React from "react";
import { Badge } from "@/components/ui/badge";

interface LocationStatusBadgeProps {
  status: string;
}

export const LocationStatusBadge: React.FC<LocationStatusBadgeProps> = ({ status }) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-600 hover:bg-green-500/30";
      case "maintenance":
        return "bg-amber-500/20 text-amber-600 hover:bg-amber-500/30";
      case "inactive":
        return "bg-red-500/20 text-red-600 hover:bg-red-500/30";
      default:
        return "";
    }
  };

  return (
    <Badge 
      className={`capitalize ${getStatusBadgeVariant(status)}`}
    >
      {status}
    </Badge>
  );
};
