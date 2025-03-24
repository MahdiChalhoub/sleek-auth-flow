
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Bell, UserCircle, Building, ChevronDown } from "lucide-react";
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
import { SidebarTrigger } from "@/components/ui/sidebar";
import MobileDrawerMenu from "./MobileDrawerMenu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const getPageTitle = (pathname: string): string => {
  const routes: Record<string, string> = {
    "/home": "Dashboard",
    "/pos-sales": "POS Sales",
    "/inventory": "Inventory",
    "/purchase-orders": "Purchase Orders",
    "/returns": "Returns",
    "/settings": "Settings",
    "/register": "Register",
    "/register-sessions": "Register Sessions",
    "/transactions": "Transactions",
    "/transaction-permissions": "Transaction Permissions",
    "/suppliers": "Suppliers",
    "/stock-transfers": "Stock Transfers",
    "/staff-finance": "Staff Finance",
    "/loyalty": "Loyalty & Rewards",
  };
  
  return routes[pathname] || "POS System";
};

const AppTopbar: React.FC = () => {
  const { user, logout, currentBusiness, userBusinesses, switchBusiness } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = getPageTitle(location.pathname);
  const [isBusinessDialogOpen, setIsBusinessDialogOpen] = useState(false);
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  const handleSwitchBusiness = (businessId: string) => {
    switchBusiness(businessId);
    setIsBusinessDialogOpen(false);
  };
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <MobileDrawerMenu>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </MobileDrawerMenu>
        <h1 className="text-xl font-semibold">{pageTitle}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {currentBusiness && user?.isGlobalAdmin && (
          <Dialog open={isBusinessDialogOpen} onOpenChange={setIsBusinessDialogOpen}>
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
                <ChevronDown className="h-3 w-3 opacity-50" />
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
        )}
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
            3
          </span>
        </Button>
        
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
            {currentBusiness && user?.isGlobalAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Businesses</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setIsBusinessDialogOpen(true)}>
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
      </div>
    </header>
  );
};

export default AppTopbar;
