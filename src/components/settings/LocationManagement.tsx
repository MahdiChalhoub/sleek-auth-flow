
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, MapPin, Building, Phone, Mail, User, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Branch, mockBranches } from "@/models/interfaces/businessInterfaces";
import { AddLocationModal } from "./AddLocationModal";

interface LocationManagementProps {
  businessId: string;
}

export const LocationManagement: React.FC<LocationManagementProps> = ({ businessId }) => {
  const [locations, setLocations] = useState<Branch[]>(
    mockBranches.filter(branch => branch.businessId === businessId)
  );
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  
  const handleAddLocation = (newLocation: Branch) => {
    setLocations(prev => [...prev, { ...newLocation, businessId }]);
    setIsAddLocationModalOpen(false);
  };
  
  const handleDeleteLocation = (id: string) => {
    if (window.confirm("Are you sure you want to delete this location? This action cannot be undone.")) {
      setLocations(prev => prev.filter(location => location.id !== id));
    }
  };
  
  const handleToggleLocationStatus = (id: string) => {
    setLocations(prev =>
      prev.map(location =>
        location.id === id
          ? { 
              ...location, 
              status: location.status === "active" ? "inactive" : "active" 
            }
          : location
      )
    );
  };
  
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
  
  const getTypeIcon = (type: string) => {
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
                        {getTypeIcon(location.type)}
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
                    <Badge 
                      className={`capitalize ${getStatusBadgeVariant(location.status)}`}
                    >
                      {location.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => console.log("Edit", location.id)} className="flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleLocationStatus(location.id)} className="flex items-center gap-2">
                          {location.status === "active" ? (
                            <>Deactivate</>
                          ) : (
                            <>Activate</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteLocation(location.id)} 
                          className="flex items-center gap-2 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
      </CardContent>
      
      <AddLocationModal 
        isOpen={isAddLocationModalOpen}
        onClose={() => setIsAddLocationModalOpen(false)}
        onSave={handleAddLocation}
      />
    </Card>
  );
};
