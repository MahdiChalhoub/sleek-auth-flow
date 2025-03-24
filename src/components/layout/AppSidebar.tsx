
import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  ClipboardList, 
  RotateCcw, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  CreditCard,
  Repeat,
  FileText,
  ShieldCheck,
  BarChart3,
  DollarSign,
  Gift,
  Briefcase
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/hooks/use-mobile";
import { 
  Sidebar, 
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
  roles?: string[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: BarChart3,
    roles: ["admin", "manager", "cashier"]
  },
  {
    title: "Home",
    path: "/home",
    icon: LayoutDashboard,
    roles: ["admin", "manager", "cashier"]
  },
  {
    title: "POS Sales",
    path: "/pos-sales",
    icon: ShoppingCart,
    roles: ["admin", "cashier", "manager"]
  },
  {
    title: "Register",
    path: "/register",
    icon: CreditCard,
    roles: ["admin", "cashier", "manager"]
  },
  {
    title: "Register Sessions",
    path: "/register-sessions",
    icon: FileText,
    roles: ["admin", "manager"]
  },
  {
    title: "Transactions",
    path: "/transactions",
    icon: Repeat,
    roles: ["admin", "manager"]
  },
  {
    title: "Transaction Permissions",
    path: "/transaction-permissions",
    icon: ShieldCheck,
    roles: ["admin"]
  },
  {
    title: "Staff Finance",
    path: "/staff-finance",
    icon: Briefcase,
    roles: ["admin", "manager"]
  },
  {
    title: "Loyalty & Rewards",
    path: "/loyalty",
    icon: Gift,
    roles: ["admin", "manager", "cashier"]
  },
  {
    title: "Inventory",
    path: "/inventory",
    icon: Package,
    roles: ["admin", "manager"]
  },
  {
    title: "Suppliers",
    path: "/suppliers",
    icon: Users,
    roles: ["admin", "manager"]
  },
  {
    title: "Purchase Orders",
    path: "/purchase-orders",
    icon: ClipboardList,
    roles: ["admin", "manager"]
  },
  {
    title: "Stock Transfers",
    path: "/stock-transfers",
    icon: Repeat,
    roles: ["admin", "manager"]
  },
  {
    title: "Returns",
    path: "/returns",
    icon: RotateCcw,
    roles: ["admin", "cashier", "manager"]
  },
  {
    title: "Role Management",
    path: "/roles",
    icon: Users,
    roles: ["admin"]
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["admin"]
  }
];

const AppSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { isMobile } = useScreenSize();
  const { state, toggleSidebar } = useSidebar();
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
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center gap-2", state === "collapsed" && "justify-center")}>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              POS
            </div>
            {state !== "collapsed" && (
              <div className="font-semibold">POS System</div>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="hidden md:flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
          >
            {state === "collapsed" ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {filteredNavItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.path}
                tooltip={item.title}
                onClick={() => handleNavigation(item.path)}
              >
                <div className="w-full">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="mt-auto p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              onClick={handleLogout}
              className="text-destructive hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
