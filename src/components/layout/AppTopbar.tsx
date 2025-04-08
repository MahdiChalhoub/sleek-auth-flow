
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
  ShoppingCart,
  Home,
  Package,
  Users
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/types/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { useScreenSize } from "@/hooks/use-mobile";
import { ROUTES } from "@/constants/routes";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const AppTopbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();
  const { setTheme } = useTheme();
  const { isMobile, isTablet, isLaptop } = useScreenSize();
  const navigate = useNavigate();

  const typedUser = user as User;
  console.log('🔝 AppTopbar rendering with user:', !!user);

  const showTopNav = isLaptop || (!isMobile && !isTablet);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center gap-2 border-b bg-background px-2 md:px-4 lg:px-6">
      <Button
        variant="outline"
        size="icon"
        className="mr-2 flex-shrink-0"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {showTopNav && (
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink 
                className={navigationMenuTriggerStyle()} 
                onClick={() => navigate(ROUTES.HOME)}
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink 
                className={navigationMenuTriggerStyle()} 
                onClick={() => navigate(ROUTES.INVENTORY)}
              >
                <Package className="mr-2 h-4 w-4" />
                Inventory
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink 
                className={navigationMenuTriggerStyle()} 
                onClick={() => navigate(ROUTES.POS_SALES)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Sales
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink 
                className={navigationMenuTriggerStyle()} 
                onClick={() => navigate(ROUTES.ROLES)}
              >
                <Users className="mr-2 h-4 w-4" />
                Roles
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}

      <div className={cn("flex-1", showTopNav ? "md:mx-4 lg:mx-6" : "")}>
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

      <div className="flex items-center gap-1 md:gap-2">
        <Button
          variant="outline"
          size="icon"
          className="mr-1 hidden md:flex"
          onClick={() => navigate(ROUTES.POS_SALES)}
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Open POS</span>
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme("light")}
          className="mr-1 hidden sm:flex"
        >
          <Sun className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Light Mode</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme("dark")}
          className="mr-1 hidden sm:flex"
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
                  <span className="line-clamp-1 text-sm font-medium max-w-[100px] hidden md:inline">
                    {typedUser?.fullName || typedUser?.email?.split("@")[0] || "User"}
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
                  {typedUser?.fullName || typedUser?.email?.split("@")[0] || "User"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {typedUser?.email}
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
