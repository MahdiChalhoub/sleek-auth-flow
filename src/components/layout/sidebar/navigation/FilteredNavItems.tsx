
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
  
  const isActive = (path: string) => location.pathname === path;
  
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
