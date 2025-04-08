
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/providers/AuthProvider";

interface NavItem {
  label: string;
  icon: React.ElementType;
  route: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: "Home", icon: Home, route: ROUTES.HOME, roles: ["admin", "manager", "cashier"] },
  { label: "Inventory", icon: Package, route: ROUTES.INVENTORY, roles: ["admin", "manager"] },
  { label: "POS", icon: ShoppingCart, route: ROUTES.POS_SALES, roles: ["admin", "cashier", "manager"] },
  { label: "Clients", icon: Users, route: "/clients", roles: ["admin", "manager", "cashier"] },
  { label: "Finance", icon: FileText, route: ROUTES.TRANSACTIONS, roles: ["admin", "manager"] },
];

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const filteredItems = navItems.filter(item => 
    !item.roles || (user && item.roles.includes(user.role))
  ).slice(0, 5); // Limit to 5 items for bottom nav
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-background border-t">
      <div className="flex items-center justify-around">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.route;
          
          return (
            <button
              key={item.route}
              className={cn(
                "flex flex-1 flex-col items-center py-2 text-xs",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => navigate(item.route)}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
