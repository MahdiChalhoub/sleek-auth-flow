
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  ClipboardList, 
  RotateCcw, 
  Settings, 
  LogOut,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
  roles?: string[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    path: "/home",
    icon: LayoutDashboard,
    roles: ["admin", "manager"]
  },
  {
    title: "POS Sales",
    path: "/pos-sales",
    icon: ShoppingCart,
    roles: ["admin", "cashier", "manager"]
  },
  {
    title: "Inventory",
    path: "/inventory",
    icon: Package,
    roles: ["admin", "manager"]
  },
  {
    title: "Purchase Orders",
    path: "/purchase-orders",
    icon: ClipboardList,
    roles: ["admin", "manager"]
  },
  {
    title: "Returns",
    path: "/returns",
    icon: RotateCcw,
    roles: ["admin", "cashier", "manager"]
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["admin"]
  }
];

interface MobileDrawerMenuProps {
  children: React.ReactNode;
}

const MobileDrawerMenu: React.FC<MobileDrawerMenuProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const filteredNavItems = navItems.filter(
    item => !item.roles || (user && item.roles.includes(user.role))
  );
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="h-full w-[250px] left-0 right-auto rounded-r-lg">
        <DrawerHeader className="border-b px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                POS
              </div>
              <DrawerTitle className="text-lg font-semibold">POS System</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        
        <div className="flex flex-col p-2">
          {filteredNavItems.map((item) => (
            <DrawerClose asChild key={item.path}>
              <Button
                variant="ghost"
                className={`
                  justify-start w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${location.pathname === item.path 
                    ? 'bg-accent text-accent-foreground' 
                    : 'hover:bg-accent/50'}
                `}
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Button>
            </DrawerClose>
          ))}
        </div>
        
        <DrawerFooter className="border-t p-0">
          <DrawerClose asChild>
            <Button
              variant="ghost"
              className="flex w-full items-center justify-start gap-3 rounded-none px-6 py-3 text-sm font-medium text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileDrawerMenu;
