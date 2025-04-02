
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MapPin, Building, Store, Warehouse, Briefcase, MoreHorizontal } from 'lucide-react';
import { useLocationContext } from '@/contexts/LocationContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export function LocationSelector() {
  const { currentLocation, availableLocations, isLoadingLocations, switchLocation } = useLocationContext();
  const [isOpen, setIsOpen] = useState(false);
  
  if (isLoadingLocations) {
    return (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 opacity-70" />
        <Skeleton className="h-4 w-20" />
      </div>
    );
  }

  if (!currentLocation) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>No location</span>
      </div>
    );
  }

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'retail':
        return <Store className="h-4 w-4 mr-2" />;
      case 'warehouse':
        return <Warehouse className="h-4 w-4 mr-2" />;
      case 'office':
        return <Briefcase className="h-4 w-4 mr-2" />;
      default:
        return <Building className="h-4 w-4 mr-2" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" className="ml-2 px-1 py-0 text-[10px]">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="ml-2 px-1 py-0 text-[10px]">Inactive</Badge>;
      case 'pending':
        return <Badge variant="outline" className="ml-2 px-1 py-0 text-[10px]">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2 max-w-[180px]">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{currentLocation.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Switch Location
          </div>
          {availableLocations.map((location) => (
            <DropdownMenuItem 
              key={location.id}
              onClick={() => {
                switchLocation(location.id);
                setIsOpen(false);
              }}
              className="flex items-center gap-1"
            >
              {getLocationIcon(location.type)}
              <span className="flex-1 truncate">{location.name}</span>
              {getStatusBadge(location.status)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-start cursor-pointer" 
            size="sm"
          >
            <MoreHorizontal className="h-4 w-4 mr-2" />
            Manage Locations
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
