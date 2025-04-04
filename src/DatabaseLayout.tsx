import { useNavigate } from "react-router";
import { useAppContext } from "./context/AppContext";
import { useEffect } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "./components/ui/sidebar";
import DatabaseSidebar from "./components/ui/database/database-sidebar";
import { TabProvider, useTabContext } from "./context/database/TabContext";
import { Tabs, TabsList } from "./components/ui/tabs";
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import { Button } from "./components/ui/button";
import { Database, X } from "lucide-react";
import { cn } from "./lib/utils";
import DataView from "./components/ui/database/data-view";

function DatabaseLayout() {
  const navigate = useNavigate();
  const { dbClient } = useAppContext();

  useEffect(() => {
    if (!dbClient) {
      navigate("/");
    }
  }, [dbClient]);

  return (
    <TabProvider>
      <SidebarProvider>
        <DatabaseSidebar />
        <main className="w-full">
          <TabsPanel />
        </main>
      </SidebarProvider>
    </TabProvider>
  );
}

function TabsPanel() {
  const { tabs, activeTab, setActiveTab, closeTab } = useTabContext();
  const {open, isMobile, openMobile} = useSidebar();
  return tabs.length > 0 ? (
    <Tabs value={activeTab || undefined} className="w-full gap-0 ">
      <div className="flex items-center gap-2 w-full bg-sidebar border-b h-14 overflow-y-hidden">
        <SidebarTrigger className="ml-2" />
        <TabsList className="rounded-none !bg-transparent flex divide-x !pb-0 h-14">
          {tabs.map((tableName) => {
            return (
              <TabsTrigger
                key={tableName.name}
                value={tableName.name}
                className={cn(
                  "first:border-l last:border-r gap-4 test p-2 flex items-center justify-between min-w-32 group rounded-t-md border-t border-b ",
                  activeTab === tableName.name
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground"
                )}
                onClick={() => setActiveTab(tableName.name)}
              >
                <span className="font-semibold min-w-24 text-sm text-start ml-2 ">
                  {tableName.name}
                </span>
                <div className="size-4">
                  <Button
                    data-state={activeTab === tableName.name ? "active" : ""}
                    variant="ghost"
                    size="icon"
                    className="h-auto w-full rounded-full p-0 hidden hover:bg-destructive/20 group-hover:flex data-[state=active]:flex"
                    onClick={(_) => closeTab(tableName.name)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Close tab</span>
                  </Button>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      <div className=" ">
        {tabs.map((tab) => {
          return (
            <TabsContent
              key={tab.name}
              value={tab.name}
              className={cn(
                "mt-0 border-0 p-0 overflow-scroll h-[calc(100vh-56px)]",
                {
                  "w-[calc(100vw-256px)]": open || (isMobile && openMobile),
                  "w-screen": !open || (isMobile),
                }
              )}
            >
              <DataView tableName={tab.name} />
            </TabsContent>
          );
        })}
      </div>
    </Tabs>
  ) : (
    <>
      <SidebarTrigger className="fixed top-3.5 left-2" />
      <div className="flex h-full items-center justify-center select-none w-full">
        <div className="text-center">
          <Database className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No tables open</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Select a table from the sidebar to view its data
          </p>
        </div>
      </div>
    </>
  );
}

export default DatabaseLayout;
