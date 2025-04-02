
import React, { useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, Building, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openBusinessDialog: () => void;
  openLocationDialog: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ 
  isOpen, 
  onOpenChange,
  openBusinessDialog, 
  openLocationDialog 
}) => {
  const { user, logout, currentBusiness } = useAuth();
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const handleNavigate = useCallback((path: string) => {
    navigate(path);
    onOpenChange?.(false);
  }, [navigate, onOpenChange]);
  
  // Handler to toggle menu state
  const handleButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent event propagation to avoid auto-closing
    e.stopPropagation();
    // Toggle the menu state manually
    onOpenChange?.(!isOpen);
  }, [isOpen, onOpenChange]);
  
  // Get user display name safely
  const userDisplayName = user?.fullName || user?.name || user?.email?.split('@')[0] || 'User';
  
  // Check if user is admin (compatible with both properties)
  const isAdmin = user?.isGlobalAdmin || user?.role === 'admin';
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          ref={buttonRef}
          onClick={handleButtonClick}
          aria-expanded={isOpen}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatarUrl} alt={userDisplayName} />
            <AvatarFallback>{userDisplayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium">{userDisplayName}</div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-[10px]">{user?.role}</Badge>
              {currentBusiness && (
                <Badge variant="secondary" className="text-[10px]">
                  {currentBusiness.name}
                </Badge>
              )}
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56"
        onPointerDownOutside={(e) => {
          // Don't close when clicking the trigger button
          if (buttonRef.current?.contains(e.target as Node)) {
            e.preventDefault();
          }
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleNavigate("/profile")}>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate("/settings")}>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Locations</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => {
          openLocationDialog();
          onOpenChange?.(false);
        }}>
          <MapPin className="mr-2 h-4 w-4" />
          Switch Location
        </DropdownMenuItem>
        {currentBusiness && isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Businesses</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => {
              openBusinessDialog();
              onOpenChange?.(false);
            }}>
              <Building className="mr-2 h-4 w-4" />
              Switch Business
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {
          logout();
          onOpenChange?.(false);
        }} className="text-destructive">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
