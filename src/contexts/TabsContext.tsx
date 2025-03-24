import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export interface Tab {
  id: string;
  title: string;
  path: string;
  icon?: React.ElementType;
}

interface TabsContextType {
  tabs: Tab[];
  activeTabId: string | null;
  openTab: (tab: Omit<Tab, "id">) => void;
  closeTab: (tabId: string) => void;
  activateTab: (tabId: string) => void;
  isTabOpen: (path: string) => boolean;
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
            navigate(activeTab.path);
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

  // Open a tab if not already open
  const openTab = (tab: Omit<Tab, "id">) => {
    const existingTab = tabs.find(t => t.path === tab.path);
    
    if (existingTab) {
      setActiveTabId(existingTab.id);
      if (location.pathname !== tab.path) {
        navigate(tab.path);
      }
      return;
    }
    
    const newTab = { ...tab, id: `tab-${Date.now()}` };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    
    if (location.pathname !== tab.path) {
      navigate(tab.path);
    }
  };

  // Close a tab
  const closeTab = (tabId: string) => {
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;
    
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    
    // If the active tab is being closed, activate another tab
    if (activeTabId === tabId && newTabs.length > 0) {
      // Try to activate the tab to the left, or the first tab if there isn't one
      const newActiveTab = newTabs[tabIndex > 0 ? tabIndex - 1 : 0];
      setActiveTabId(newActiveTab.id);
      navigate(newActiveTab.path);
    } else if (newTabs.length === 0) {
      setActiveTabId(null);
      navigate('/home');
    }
  };

  // Activate a tab
  const activateTab = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setActiveTabId(tabId);
      if (location.pathname !== tab.path) {
        navigate(tab.path);
      }
    }
  };

  // Check if a tab with the given path is already open
  const isTabOpen = (path: string) => {
    return tabs.some(t => t.path === path);
  };

  return (
    <TabsContext.Provider value={{ 
      tabs, 
      activeTabId, 
      openTab, 
      closeTab, 
      activateTab,
      isTabOpen 
    }}>
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
