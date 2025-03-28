
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
  
  const isActive = (path: string) => {
    // Handle exact path matching 
    if (location.pathname === path) return true;
    
    // Handle parent routes with child routes
    // For example, if path is "/inventory" and current location is "/inventory/item/123"
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    
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
