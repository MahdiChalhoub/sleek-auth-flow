
import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useTabs, Tab } from "@/contexts/TabsContext";
import { useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { navItems } from "./sidebar/navItems";

const TabNavigation: React.FC = () => {
  const { tabs, activeTabId, closeTab, activateTab, openTab } = useTabs();
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Sync current route with tabs
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
  }, [location.pathname]);

  // Scroll active tab into view
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

const TabButton = React.forwardRef<HTMLButtonElement, TabButtonProps>(
  ({ tab, isActive, onClick, onClose }, ref) => {
    // Check if the icon is a valid React component before rendering
    const IconComponent = tab.icon;
    
    return (
      <button
        ref={ref}
        className={cn(
          "group flex h-10 items-center gap-2 border-r px-4 text-sm font-medium transition-colors hover:bg-muted/50",
          isActive ? "bg-background text-foreground" : "text-muted-foreground"
        )}
        onClick={onClick}
      >
        {IconComponent && typeof IconComponent === 'function' && <IconComponent className="h-4 w-4" />}
        <span>{tab.title}</span>
        <button
          className="ml-1 rounded-sm opacity-60 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </button>
    );
  }
);

TabButton.displayName = "TabButton";

export default TabNavigation;
