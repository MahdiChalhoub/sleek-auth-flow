
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "@/components/ui/sidebar";
import { NavItem, navItems } from "./nav"; // Updated import
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useTabs } from "@/contexts/TabsContext";

const SidebarNavigation: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { openTab } = useTabs();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  
  const filteredNavItems = navItems.filter(
    item => !item.roles || (user && item.roles.includes(user.role))
  );
  
  const handleNavigation = (item: NavItem) => {
    if (item.children) {
      // Toggle the group open/closed
      setOpenGroups(prev => ({ ...prev, [item.title]: !prev[item.title] }));
    } else {
      // Navigate and open tab
      navigate(item.path);
      openTab({
        title: item.title,
        path: item.path,
        icon: item.icon
      });
    }
  };
  
  const isItemActive = (path: string) => location.pathname === path;
  
  const renderNavItem = (item: NavItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isGroupOpen = openGroups[item.title];
    const Icon = item.icon;
    
    return (
      <SidebarMenuItem key={item.path}>
        {hasChildren ? (
          <Collapsible open={isGroupOpen} onOpenChange={() => setOpenGroups(prev => ({ ...prev, [item.title]: !prev[item.title] }))}>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton 
                className="w-full justify-between"
                isActive={isItemActive(item.path) || (hasChildren && item.children?.some(child => isItemActive(child.path)))}
                tooltip={item.title}
              >
                <div className="flex items-center">
                  {Icon && <Icon className="h-5 w-5 mr-2" />}
                  <span>{item.title}</span>
                </div>
                {isGroupOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.children?.map(child => {
                  const ChildIcon = child.icon;
                  return (
                    <SidebarMenuSubItem key={child.path}>
                      <SidebarMenuSubButton
                        onClick={() => {
                          navigate(child.path);
                          openTab({
                            title: child.title,
                            path: child.path,
                            icon: child.icon
                          });
                        }}
                        isActive={isItemActive(child.path)}
                      >
                        {ChildIcon && <ChildIcon className="h-4 w-4 mr-2" />}
                        <span>{child.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <SidebarMenuButton
            isActive={isItemActive(item.path)}
            tooltip={item.title}
            onClick={() => handleNavigation(item)}
          >
            {Icon && <Icon className="h-5 w-5" />}
            <span>{item.title}</span>
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    );
  };
  
  return (
    <SidebarContent>
      <SidebarMenu>
        {filteredNavItems.map(renderNavItem)}
      </SidebarMenu>
    </SidebarContent>
  );
};

export default SidebarNavigation;
