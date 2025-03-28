
import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useTabs, Tab } from "@/contexts/tabs";
import { useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { navItems } from "./sidebar/nav";

const TabNavigation: React.FC = () => {
  const { tabs, activeTabId, closeTab, activateTab, openTab, findTabByPath } = useTabs();
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLDivElement>(null);

  // Find the active tab based on the current location
  const currentPath = location.pathname;
  
  // Effect to open a tab when navigating to a new route
  useEffect(() => {
    // Only process routes under the app layout (skip login, etc)
    if (location.pathname === '/' || location.pathname.startsWith('/login') || location.pathname.startsWith('/signup')) {
      return;
    }
    
    // Check if we already have a tab for this path
    const existingTab = findTabByPath(location.pathname);
    if (existingTab) {
      if (existingTab.id !== activeTabId) {
        activateTab(existingTab.id);
      }
      return;
    }
    
    // Special case handling for redirects
    if (location.pathname === '/contacts') {
      const clientsTab = findTabByPath('/clients');
      if (clientsTab) {
        activateTab(clientsTab.id);
        return;
      }
    }
    
    // Find matching nav item for the current path
    const matchingNavItem = findMatchingNavItem(location.pathname);
    
    if (matchingNavItem) {
      openTab({
        title: matchingNavItem.title,
        path: location.pathname,
        icon: matchingNavItem.icon
      });
    }
  }, [location.pathname, openTab, activateTab, findTabByPath, activeTabId]);

  // Function to find matching nav item for a path, supporting dynamic routes
  const findMatchingNavItem = (path: string) => {
    // Check all nav items and their children
    const allItems = getAllNavItems();
    
    // First check for exact path match
    const exactMatch = allItems.find(item => item.path === path);
    if (exactMatch) return exactMatch;
    
    // Then check for dynamic path matches (e.g., /products/view/123 matching /products/view/:id)
    const pathSegments = path.split('/').filter(Boolean);
    
    return allItems.find(item => {
      const itemSegments = item.path.split('/').filter(Boolean);
      
      // Skip if segment count doesn't match
      if (pathSegments.length !== itemSegments.length) return false;
      
      // Check each segment for match or pattern
      return itemSegments.every((segment, i) => {
        if (segment.startsWith(':')) return true; // Dynamic segment always matches
        return segment === pathSegments[i];
      });
    });
  };
  
  // Helper to flatten all nav items (including children)
  const getAllNavItems = () => {
    const flattenItems: NavItemType[] = [];
    
    const processItems = (items: NavItemType[]) => {
      items.forEach(item => {
        flattenItems.push(item);
        if (item.children && item.children.length > 0) {
          processItems(item.children);
        }
      });
    };
    
    processItems(navItems);
    return flattenItems;
  };
  
  // Scroll to active tab when it changes
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const tabElement = activeTabRef.current;
      const container = scrollContainerRef.current;
      
      // Calculate if active tab is in view, if not, scroll to it
      if (tabElement.offsetLeft < container.scrollLeft) {
        container.scrollLeft = tabElement.offsetLeft;
      } else if (tabElement.offsetLeft + tabElement.offsetWidth > container.scrollLeft + container.offsetWidth) {
        container.scrollLeft = tabElement.offsetLeft + tabElement.offsetWidth - container.offsetWidth;
      }
    }
  }, [activeTabId]);

  // Don't render anything if there are no tabs
  if (tabs.length === 0) {
    return null;
  }

  // Use defensive programming to prevent crashes during loading
  // By adding a fixed width container as a fallback
  return (
    <div className="border-b bg-background/90 backdrop-blur-sm">
      <ScrollArea className="w-full">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto hide-scrollbar min-w-0"
          style={{ minHeight: '40px' }} // Ensure container has minimum height even when empty
        >
          {tabs && tabs.length > 0 ? (
            tabs.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                isActive={tab.id === activeTabId}
                onClick={() => activateTab(tab.id)}
                onClose={() => closeTab(tab.id)}
                ref={tab.id === activeTabId ? activeTabRef : undefined}
              />
            ))
          ) : (
            // Render an empty placeholder to maintain layout during loading
            <div className="h-10 w-full"></div>
          )}
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

// Extracting needed type for TypeScript
type NavItemType = {
  title: string;
  path: string;
  icon?: React.ElementType;
  children?: NavItemType[];
};

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
        role="button"
        aria-selected={isActive}
        tabIndex={0}
      >
        {hasValidIcon && <IconComponent className="h-4 w-4" />}
        <span>{tab.title}</span>
        <button
          className="ml-1 rounded-sm opacity-60 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label={`Close ${tab.title} tab`}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    );
  }
);

TabButton.displayName = "TabButton";

export default TabNavigation;
