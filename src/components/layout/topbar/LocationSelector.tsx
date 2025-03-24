
import React from "react";
import { MapPin } from "lucide-react";
import { useLocationContext } from "@/contexts/LocationContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LocationSelectorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ isOpen, onOpenChange }) => {
  const { currentLocation, availableLocations, switchLocation } = useLocationContext();
  
  if (!currentLocation) return null;
  
  const handleSwitchLocation = (locationId: string) => {
    switchLocation(locationId);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="hidden sm:flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border-slate-200" 
        >
          <MapPin className="h-4 w-4 text-blue-600" />
          <span>{currentLocation.name}</span>
          <Badge variant="secondary" className="ml-1 text-xs">
            {currentLocation.type}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Switch Location</DialogTitle>
          <DialogDescription>
            Select a location to switch to
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh]">
          <div className="grid gap-4 py-4">
            {availableLocations.map((loc) => (
              <Button
                key={loc.id}
                variant={loc.id === currentLocation.id ? "default" : "outline"}
                className="flex items-center justify-start gap-2 w-full"
                onClick={() => handleSwitchLocation(loc.id)}
              >
                <div className={`p-2 rounded-full ${
                  loc.type === 'store' ? 'bg-blue-100' : 
                  loc.type === 'warehouse' ? 'bg-amber-100' : 'bg-green-100'
                }`}>
                  <MapPin className={`h-4 w-4 ${
                    loc.type === 'store' ? 'text-blue-600' : 
                    loc.type === 'warehouse' ? 'text-amber-600' : 'text-green-600'
                  }`} />
                </div>
                <div className="flex flex-col items-start">
                  <span>{loc.name}</span>
                  <span className="text-xs text-muted-foreground">{loc.address}</span>
                </div>
                {loc.id === currentLocation.id && (
                  <Badge className="ml-auto">Active</Badge>
                )}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LocationSelector;
