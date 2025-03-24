
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, User } from "lucide-react";
import { Branch } from "@/models/interfaces/businessInterfaces";
import { LocationTypeIcon } from "./LocationTypeIcon";
import { LocationStatusBadge } from "./LocationStatusBadge";
import { LocationActions } from "./LocationActions";

interface LocationListProps {
  locations: Branch[];
  onDeleteLocation: (id: string) => void;
  onToggleLocationStatus: (id: string) => void;
}

export const LocationList: React.FC<LocationListProps> = ({
  locations,
  onDeleteLocation,
  onToggleLocationStatus,
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name & Type</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((location) => (
            <TableRow key={location.id} className="hover:bg-muted/40">
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <LocationTypeIcon type={location.type} />
                    {location.name}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize mt-1">
                    {location.type}
                    {location.isDefault && (
                      <Badge variant="outline" className="ml-2 text-[10px]">Default</Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{location.address}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs">{location.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs">{location.email || "N/A"}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {location.managerId === "user-manager" ? "Mike Manager" : 
                     location.managerId === "user-cashier" ? "Cathy Cashier" : "Unassigned"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <LocationStatusBadge status={location.status} />
              </TableCell>
              <TableCell className="text-right">
                <LocationActions 
                  locationId={location.id} 
                  status={location.status}
                  onToggleStatus={onToggleLocationStatus}
                  onDelete={onDeleteLocation}
                />
              </TableCell>
            </TableRow>
          ))}
          {locations.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No locations found. Click "Add Location" to create one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
