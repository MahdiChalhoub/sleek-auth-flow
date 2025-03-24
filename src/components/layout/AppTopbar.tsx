
import React from "react";
import { useLocation } from "react-router-dom";
import { Menu, Bell, UserCircle } from "lucide-react";
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
  };
  
  return routes[pathname] || "POS System";
};

const AppTopbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-xl font-semibold">{pageTitle}</h1>
      </div>
      
      <div className="flex items-center gap-4">
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
                <Badge variant="outline" className="text-[10px]">{user?.role}</Badge>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
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
