import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { findTabByPath } from "./tabUtils";
import { Tab } from "./types";

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

  useEffect(() => {
    localStorage.setItem('appTabs', JSON.stringify(tabs));
    if (activeTabId) {
      localStorage.setItem('activeTabId', activeTabId);
    }
  }, [tabs, activeTabId]);

  const findTabByPathFn = (path: string): Tab | undefined => {
    return findTabByPath(tabs, path);
  };

  const openTab = (tab: Omit<Tab, "id">) => {
    const existingTab = findTabByPathFn(tab.path);
    
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
  };

  const closeTab = (tabId: string) => {
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;
    
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    
    if (activeTabId === tabId && newTabs.length > 0) {
      const newActiveTab = newTabs[tabIndex > 0 ? tabIndex - 1 : 0];
      setActiveTabId(newActiveTab.id);
      navigate(newActiveTab.path, { replace: true });
    } else if (newTabs.length === 0) {
      setActiveTabId(null);
      navigate('/home', { replace: true });
    }
  };

  const activateTab = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setActiveTabId(tabId);
      if (location.pathname !== tab.path) {
        navigate(tab.path, { replace: true });
      }
    }
  };

  const isTabOpen = (path: string) => {
    return !!findTabByPathFn(path);
  };

  const getTabState = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    return tab?.state;
  };

  const updateTabState = (tabId: string, state: Record<string, any>) => {
    setTabs(prev => 
      prev.map(tab => 
        tab.id === tabId 
          ? { ...tab, state: { ...tab.state, ...state } } 
          : tab
      )
    );
  };

  const contextValue = {
    tabs, 
    activeTabId, 
    openTab, 
    closeTab, 
    activateTab,
    isTabOpen,
    findTabByPath: findTabByPathFn,
    getTabState,
    updateTabState
  };

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
