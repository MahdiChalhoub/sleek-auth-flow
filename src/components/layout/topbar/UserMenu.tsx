
import React from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, Building, ChevronDown, MapPin } from "lucide-react";
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
  openBusinessDialog: () => void;
  openLocationDialog: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ 
  openBusinessDialog, 
  openLocationDialog 
}) => {
  const { user, logout, currentBusiness } = useAuth();
  const navigate = useNavigate();
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatarUrl} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium">{user?.name}</div>
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
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleNavigate("/profile")}>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate("/settings")}>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Locations</DropdownMenuLabel>
        <DropdownMenuItem onClick={openLocationDialog}>
          <MapPin className="mr-2 h-4 w-4" />
          Switch Location
        </DropdownMenuItem>
        {currentBusiness && user?.isGlobalAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Businesses</DropdownMenuLabel>
            <DropdownMenuItem onClick={openBusinessDialog}>
              <Building className="mr-2 h-4 w-4" />
              Switch Business
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-destructive">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
