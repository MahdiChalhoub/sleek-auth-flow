
import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useTabs, Tab } from "@/contexts/TabsContext";
import { useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { navItems } from "./sidebar/nav";

const TabNavigation: React.FC = () => {
  const { tabs, activeTabId, closeTab, activateTab, openTab } = useTabs();
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.pathname === '/') return;
    
    const matchingNavItem = navItems.find(item => item.path === location.pathname);
    if (!tabs.some(tab => tab.path === location.pathname) && matchingNavItem) {
      openTab({
        title: matchingNavItem.title,
        path: matchingNavItem.path,
        icon: matchingNavItem.icon
      });
    }
  }, [location.pathname, openTab, tabs]);

  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const tabElement = activeTabRef.current;
      const container = scrollContainerRef.current;
      
      if (tabElement.offsetLeft < container.scrollLeft) {
        container.scrollLeft = tabElement.offsetLeft;
      } else if (tabElement.offsetLeft + tabElement.offsetWidth > container.scrollLeft + container.offsetWidth) {
        container.scrollLeft = tabElement.offsetLeft + tabElement.offsetWidth - container.offsetWidth;
      }
    }
  }, [activeTabId]);

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="border-b bg-background/90 backdrop-blur-sm">
      <ScrollArea className="w-full">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto hide-scrollbar"
        >
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={tab.id === activeTabId}
              onClick={() => activateTab(tab.id)}
              onClose={() => closeTab(tab.id)}
              ref={tab.id === activeTabId ? activeTabRef : undefined}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

interface TabButtonProps {
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
  onClose: () => void;
}

const TabButton = React.forwardRef<HTMLDivElement, TabButtonProps>(
  ({ tab, isActive, onClick, onClose }, ref) => {
    // Safely check if icon exists and is a valid component
    const IconComponent = tab.icon;
    const hasValidIcon = IconComponent && typeof IconComponent === 'function';
    
    return (
      <div
        ref={ref}
        className={cn(
          "group flex h-10 items-center gap-2 border-r px-4 text-sm font-medium transition-colors hover:bg-muted/50 cursor-pointer",
          isActive ? "bg-background text-foreground" : "text-muted-foreground"
        )}
        onClick={onClick}
      >
        {hasValidIcon && <IconComponent className="h-4 w-4" />}
        <span>{tab.title}</span>
        <div
          className="ml-1 rounded-sm opacity-60 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </div>
      </div>
    );
  }
);

TabButton.displayName = "TabButton";

export default TabNavigation;
