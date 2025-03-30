
import React from "react";
import { useLocation } from "react-router-dom";
import { SidebarMenu } from "@/components/ui/sidebar";
import { NavItem as NavItemType } from "../nav";
import NavItem from "./NavItem";

interface FilteredNavItemsProps {
  navItems: NavItemType[];
  userRole?: string;
}

const FilteredNavItems: React.FC<FilteredNavItemsProps> = ({ navItems, userRole }) => {
  const location = useLocation();
  
  // Filter items based on user role
  const filteredItems = navItems.filter(
    item => !item.roles || (userRole && item.roles.includes(userRole))
  );
  
  // Enhanced isActive function to handle child routes
  const isActive = (path: string) => {
    if (location.pathname === path) return true;
    
    // Check if the path is a parent of the current route
    if (path !== '/' && location.pathname.startsWith(path)) {
      // Special case for purchase parent paths
      if (path === '/purchase' && 
          (location.pathname.includes('purchase-orders') || 
           location.pathname.includes('purchase-requests') ||
           location.pathname.includes('purchase-analytics'))) {
        return true;
      }
      return true;
    }
    
    return false;
  };
  
  return (
    <SidebarMenu>
      {filteredItems.map(item => (
        <NavItem 
          key={item.path} 
          item={item} 
          isActive={isActive} 
        />
      ))}
    </SidebarMenu>
  );
};

export default FilteredNavItems;
