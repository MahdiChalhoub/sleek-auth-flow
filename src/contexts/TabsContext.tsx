
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export interface Tab {
  id: string;
  title: string;
  path: string;
  icon?: React.ElementType;
  state?: Record<string, any>;
}

interface TabsContextType {
  tabs: Tab[];
  activeTabId: string | null;
  openTab: (tab: Omit<Tab, "id">) => void;
  closeTab: (tabId: string) => void;
  activateTab: (tabId: string) => void;
  isTabOpen: (path: string) => boolean;
  findTabByPath: (path: string) => Tab | undefined;
  getTabState: (tabId: string) => Record<string, any> | undefined;
  updateTabState: (tabId: string, state: Record<string, any>) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const TabsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize tabs from localStorage if available
  useEffect(() => {
    const savedTabs = localStorage.getItem('appTabs');
    const savedActiveTab = localStorage.getItem('activeTabId');
    
    if (savedTabs) {
      try {
        const parsedTabs = JSON.parse(savedTabs);
        setTabs(parsedTabs);
        
        if (savedActiveTab) {
          setActiveTabId(savedActiveTab);
          const activeTab = parsedTabs.find((tab: Tab) => tab.id === savedActiveTab);
          if (activeTab && activeTab.path !== location.pathname) {
            navigate(activeTab.path, { replace: true });
          }
        }
      } catch (e) {
        console.error("Error parsing saved tabs:", e);
        localStorage.removeItem('appTabs');
        localStorage.removeItem('activeTabId');
      }
    }
  }, []);

  // Save tabs to localStorage when they change
  useEffect(() => {
    localStorage.setItem('appTabs', JSON.stringify(tabs));
    if (activeTabId) {
      localStorage.setItem('activeTabId', activeTabId);
    }
  }, [tabs, activeTabId]);

  // Find a tab by path
  const findTabByPath = useCallback((path: string): Tab | undefined => {
    // Check for exact path match first
    let tab = tabs.find(t => t.path === path);
    
    if (!tab) {
      // Check for pattern matching (for dynamic routes)
      // e.g., '/products/edit/123' should match a tab with path '/products/edit/:id'
      const pathSegments = path.split('/').filter(Boolean);
      
      tab = tabs.find(t => {
        const tabSegments = t.path.split('/').filter(Boolean);
        
        if (pathSegments.length !== tabSegments.length) return false;
        
        return tabSegments.every((segment, i) => {
          // If the segment starts with ':', it's a parameter
          if (segment.startsWith(':')) return true;
          return segment === pathSegments[i];
        });
      });
    }
    
    return tab;
  }, [tabs]);

  // Open a tab if not already open
  const openTab = useCallback((tab: Omit<Tab, "id">) => {
    const existingTab = findTabByPath(tab.path);
    
    if (existingTab) {
      setActiveTabId(existingTab.id);
      if (location.pathname !== tab.path) {
        navigate(tab.path, { replace: false });
      }
      return;
    }
    
    const newTab = { ...tab, id: `tab-${Date.now()}`, state: {} };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    
    if (location.pathname !== tab.path) {
      navigate(tab.path, { replace: false });
    }
  }, [findTabByPath, location.pathname, navigate]);

  // Close a tab
  const closeTab = useCallback((tabId: string) => {
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;
    
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    
    // If the active tab is being closed, activate another tab
    if (activeTabId === tabId && newTabs.length > 0) {
      // Try to activate the tab to the left, or the first tab if there isn't one
      const newActiveTab = newTabs[tabIndex > 0 ? tabIndex - 1 : 0];
      setActiveTabId(newActiveTab.id);
      navigate(newActiveTab.path, { replace: true });
    } else if (newTabs.length === 0) {
      setActiveTabId(null);
      navigate('/home', { replace: true });
    }
  }, [tabs, activeTabId, navigate]);

  // Activate a tab
  const activateTab = useCallback((tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setActiveTabId(tabId);
      if (location.pathname !== tab.path) {
        navigate(tab.path, { replace: true });
      }
    }
  }, [tabs, location.pathname, navigate]);

  // Check if a tab with the given path is already open
  const isTabOpen = useCallback((path: string) => {
    return !!findTabByPath(path);
  }, [findTabByPath]);

  // Get tab state
  const getTabState = useCallback((tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    return tab?.state;
  }, [tabs]);

  // Update tab state
  const updateTabState = useCallback((tabId: string, state: Record<string, any>) => {
    setTabs(prev => 
      prev.map(tab => 
        tab.id === tabId 
          ? { ...tab, state: { ...tab.state, ...state } } 
          : tab
      )
    );
  }, []);

  const contextValue = useMemo(() => ({ 
    tabs, 
    activeTabId, 
    openTab, 
    closeTab, 
    activateTab,
    isTabOpen,
    findTabByPath,
    getTabState,
    updateTabState
  }), [
    tabs, 
    activeTabId, 
    openTab, 
    closeTab, 
    activateTab, 
    isTabOpen, 
    findTabByPath,
    getTabState,
    updateTabState
  ]);

  return (
    <TabsContext.Provider value={contextValue}>
      {children}
    </TabsContext.Provider>
  );
};

export const useTabs = () => {
  const context = useContext(TabsContext);
  if (context === undefined) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
};
