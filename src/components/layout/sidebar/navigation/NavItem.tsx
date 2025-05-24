
import React from "react";
import { Link } from "react-router-dom";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { NavItem as NavItemType } from "../nav";

interface NavItemProps {
  item: NavItemType;
  isActive: (path: string) => boolean;
}

const NavItem: React.FC<NavItemProps> = ({ item, isActive }) => {
  const Icon = item.icon;
  const active = isActive(item.path);
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active}>
        <Link to={item.path} className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span>{String(item.title)}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default NavItem;
