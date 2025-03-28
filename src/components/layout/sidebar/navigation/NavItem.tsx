
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarMenuSub, 
  SidebarMenuSubItem, 
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useTabs } from "@/contexts/tabs"; 
import { NavItem as NavItemType } from "../nav";

interface NavItemProps {
  item: NavItemType;
  isActive: (path: string) => boolean;
}

const NavItem: React.FC<NavItemProps> = ({ item, isActive }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openTab, isTabOpen, findTabByPath, activateTab } = useTabs();
  const [isGroupOpen, setIsGroupOpen] = useState(() => {
    // Auto-expand the current section
    if (item.children) {
      return item.children.some(child => location.pathname === child.path || 
        (child.path !== '/' && location.pathname.startsWith(child.path)));
    }
    return false;
  });
  
  const hasChildren = item.children && item.children.length > 0;
  const isCurrentActive = isActive(item.path) || 
    (hasChildren && item.children?.some(child => isActive(child.path)));
  const Icon = item.icon;
  
  const handleNavigation = () => {
    if (hasChildren) {
      // Toggle the group open/closed
      setIsGroupOpen(!isGroupOpen);
    } else {
      // Navigate to the path
      const existingTab = findTabByPath(item.path);
      if (existingTab) {
        // If tab exists, just activate it
        activateTab(existingTab.id);
      } else {
        // If not, open a new tab
        openTab({
          title: item.title,
          path: item.path,
          icon: item.icon
        });
      }
      
      // Also make sure to use the router to navigate
      navigate(item.path);
    }
  };
  
  return (
    <SidebarMenuItem>
      {hasChildren ? (
        <Collapsible 
          open={isGroupOpen} 
          onOpenChange={() => setIsGroupOpen(!isGroupOpen)}
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton 
              className="w-full justify-between"
              isActive={isCurrentActive}
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
            <SubNavItems items={item.children || []} isActive={isActive} />
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <SidebarMenuButton
          isActive={isCurrentActive}
          tooltip={item.title}
          onClick={handleNavigation}
        >
          {Icon && <Icon className="h-5 w-5 mr-2" />}
          <span>{item.title}</span>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
};

export default NavItem;

interface SubNavItemsProps {
  items: NavItemType[];
  isActive: (path: string) => boolean;
}

const SubNavItems: React.FC<SubNavItemsProps> = ({ items, isActive }) => {
  const navigate = useNavigate();
  const { openTab, findTabByPath, activateTab } = useTabs();

  const handleNavigation = (item: NavItemType) => {
    // Check if tab is already open
    const existingTab = findTabByPath(item.path);
    if (existingTab) {
      // If tab exists, just activate it
      activateTab(existingTab.id);
    } else {
      // If not, open a new tab
      openTab({
        title: item.title,
        path: item.path,
        icon: item.icon
      });
    }
    
    // Use the router to navigate
    navigate(item.path);
  };

  return (
    <SidebarMenuSub>
      {items.map(child => {
        const ChildIcon = child.icon;
        return (
          <SidebarMenuSubItem key={child.path}>
            <SidebarMenuSubButton
              onClick={() => handleNavigation(child)}
              isActive={isActive(child.path)}
            >
              {ChildIcon && <ChildIcon className="h-4 w-4 mr-2" />}
              <span>{child.title}</span>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        );
      })}
    </SidebarMenuSub>
  );
};
