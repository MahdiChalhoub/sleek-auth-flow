
import React from "react";
import { Building } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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

interface BusinessSelectorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const BusinessSelector: React.FC<BusinessSelectorProps> = ({ isOpen, onOpenChange }) => {
  const { currentBusiness, userBusinesses, switchBusiness, user } = useAuth();
  
  // Check if user is admin (compatible with both properties)
  const isAdmin = user?.isGlobalAdmin || user?.role === 'admin';
  
  if (!currentBusiness || !isAdmin) return null;
  
  const handleSwitchBusiness = (businessId: string) => {
    switchBusiness(businessId);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="hidden sm:flex items-center gap-2" 
        >
          {currentBusiness.logoUrl ? (
            <img 
              src={currentBusiness.logoUrl} 
              alt={currentBusiness.name} 
              className="h-4 w-4 rounded-full"
            />
          ) : (
            <Building className="h-4 w-4" />
          )}
          {currentBusiness.name}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Switch Business</DialogTitle>
          <DialogDescription>
            Select a business to switch to
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh]">
          <div className="grid gap-4 py-4">
            {userBusinesses.map((business) => (
              <Button
                key={business.id}
                variant={business.id === currentBusiness.id ? "default" : "outline"}
                className="flex items-center justify-start gap-2 w-full"
                onClick={() => handleSwitchBusiness(business.id)}
              >
                {business.logoUrl ? (
                  <img 
                    src={business.logoUrl} 
                    alt={business.name} 
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <Building className="h-6 w-6" />
                )}
                <div className="flex flex-col items-start">
                  <span>{business.name}</span>
                  {business.description && (
                    <span className="text-xs text-muted-foreground">{business.description}</span>
                  )}
                </div>
                {business.id === currentBusiness.id && (
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

export default BusinessSelector;
