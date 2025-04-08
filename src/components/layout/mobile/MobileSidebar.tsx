
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { 
  HomeIcon, 
  PackageIcon, 
  ShoppingCart, 
  Users, 
  Settings, 
  FileText, 
  LogOut,
  User,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants/routes";
import { User as UserType } from "@/models/interfaces/userInterfaces";

interface NavItem {
  label: string;
  icon: React.ElementType;
  route: string;
  roles?: string[];
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", icon: HomeIcon, route: ROUTES.HOME, roles: ["admin", "manager", "cashier"] },
  { label: "Inventory", icon: PackageIcon, route: ROUTES.INVENTORY, roles: ["admin", "manager"] },
  { label: "POS Sales", icon: ShoppingCart, route: ROUTES.POS_SALES, roles: ["admin", "cashier", "manager"] },
  { label: "Clients", icon: Users, route: "/clients", roles: ["admin", "manager"] },
  { label: "Transactions", icon: FileText, route: ROUTES.TRANSACTIONS, roles: ["admin", "manager"] }
];

const settingsNavItems: NavItem[] = [
  { label: "User Roles", icon: Users, route: ROUTES.ROLES_LIST, roles: ["admin"] },
  { label: "Role Management", icon: Users, route: ROUTES.ROLES, roles: ["admin"] },
  { label: "Settings", icon: Settings, route: ROUTES.SETTINGS, roles: ["admin"] }
];

const MobileSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const filterItemsByRole = (items: NavItem[]) => {
    if (!user) return items;
    return items.filter(item => !item.roles || item.roles.includes(user.role));
  };
  
  const renderNavItems = (items: NavItem[]) => {
    return filterItemsByRole(items).map((item) => (
      <button
        key={item.route}
        className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-accent rounded-md"
        onClick={() => navigate(item.route)}
      >
        <item.icon className="h-5 w-5" />
        <span>{item.label}</span>
      </button>
    ));
  };
  
  // Get display name from name, fullName, or email
  const getDisplayName = () => {
    if (user?.fullName) return user.fullName;
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };
  
  // Get avatar initial from name or email
  const getAvatarInitial = () => {
    if (user?.fullName) return user.fullName.charAt(0).toUpperCase();
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };
  
  // Get avatar URL considering both properties that might be present
  const getAvatarUrl = () => {
    return user?.avatarUrl || user?.avatar_url;
  };
  
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center gap-3 p-4">
        <Avatar>
          <AvatarFallback>{getAvatarInitial()}</AvatarFallback>
          {getAvatarUrl() && <AvatarImage src={getAvatarUrl() as string} />}
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{getDisplayName()}</span>
          <span className="text-sm text-muted-foreground">{user?.email}</span>
        </div>
      </div>
      
      <Separator />
      
      <div className="flex-1 py-2">
        {renderNavItems(mainNavItems)}
      </div>
      
      <Separator />
      
      <div className="py-2">
        <div className="px-4 py-2 text-sm font-medium text-muted-foreground">
          Administration
        </div>
        {renderNavItems(settingsNavItems)}
      </div>
      
      <Separator />
      
      <div className="p-4">
        <button
          className="flex items-center gap-3 text-destructive w-full px-4 py-3 hover:bg-destructive/10 rounded-md"
          onClick={() => {
            logout();
            navigate(ROUTES.LOGIN);
          }}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default MobileSidebar;
