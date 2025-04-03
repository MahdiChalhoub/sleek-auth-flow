
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Menu, 
  Sun, 
  Moon, 
  Search, 
  Bell, 
  CircleUser,
  ChevronDown,
  Store,
  ShoppingCart
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider"; // Fix: Updated import path
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { useScreenSize } from "@/hooks/use-mobile";

const AppTopbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();
  const { setTheme } = useTheme();
  const { isMobile } = useScreenSize();
  const navigate = useNavigate();

  console.log('🔝 AppTopbar rendering with user:', !!user);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button
        variant="outline"
        size="icon"
        className="mr-2"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div className="hidden md:flex md:flex-1">
        <form className="w-full max-w-lg">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
            />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="mr-1"
          onClick={() => navigate("/pos-sales")}
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Open POS</span>
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme("light")}
          className="mr-1"
        >
          <Sun className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Light Mode</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme("dark")}
          className="mr-1"
        >
          <Moon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Dark Mode</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="mr-1"
          onClick={() => navigate("/notifications")}
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 px-3">
              <CircleUser className="h-5 w-5" />
              {!isMobile && (
                <>
                  <span className="line-clamp-1 text-sm font-medium">
                    {user?.fullName || user?.email?.split("@")[0] || "User"}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center gap-2 p-2">
              <div className="flex flex-col space-y-0.5">
                <span className="text-sm font-medium">
                  {user?.fullName || user?.email?.split("@")[0] || "User"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/business-selection")}>
              <Store className="mr-2 h-4 w-4" />
              Switch Business
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppTopbar;
