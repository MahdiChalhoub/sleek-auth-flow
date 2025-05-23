
import React from "react";
import { useAuth } from "@/providers/AuthProvider"; // Ensure consistent import
import { SidebarContent } from "@/components/ui/sidebar";
import { navItems } from "./nav"; 
import FilteredNavItems from "./navigation/FilteredNavItems";

const SidebarNavigation: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <SidebarContent>
      <FilteredNavItems 
        navItems={navItems} 
        userRole={user?.role} 
      />
    </SidebarContent>
  );
};

export default SidebarNavigation;
