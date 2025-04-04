import React, { createContext, useContext, useState } from "react";

interface Tab {
  name: string;
}

interface TabContextType {
  tabs: Tab[];
  activeTab: string | null;
  addTab: (tabName: string) => void;
  closeTab: (tabName: string) => void;
  setActiveTab: (tabName: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export const TabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const addTab = (tabName: string) => {
    const existingTab = tabs.find((tab) => tab.name === tabName);
    if (existingTab) {
      setActiveTab(existingTab.name);
    } else {
      const newTab = { name: tabName };
      setTabs((prevTabs) => [...prevTabs, newTab]);
      setActiveTab(newTab.name);
    }
  };

  const closeTab = (tabName: string) => {
    setTabs((prevTabs) => prevTabs.filter((tab) => tab.name !== tabName));
    if (activeTab === tabName) {
      setActiveTab(tabs.length > 1 ? tabs[0].name : null);
    }
  };

  return (
    <TabContext.Provider value={{ tabs, activeTab, addTab, closeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTabContext must be used within a TabProvider");
  }
  return context;
};