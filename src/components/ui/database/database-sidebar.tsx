import { useAppContext } from "@/context/AppContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "../sidebar";
import DatabasesView from "./databases-view";
import DatabaseTablesView from "./tables-view";
import { Button } from "../button";
import { RefreshCcw } from "lucide-react";

function DatabaseSidebar() {
  const { disconnectDatabase, currentProfile, tables, fetchTables } = useAppContext();

  return (
    <Sidebar>
      <SidebarHeader>
        <DatabasesView />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex gap-1 items-center">
            Entities
            <span className="text-xs font-medium bg-sidebar-accent px-1 rounded-md">
              {tables.length}
            </span>
          </SidebarGroupLabel>
          <SidebarGroupAction onClick={fetchTables} title="Refresh">
            <RefreshCcw /> <span className="sr-only">Refresh</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <DatabaseTablesView />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-secondary border-t">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-medium">{currentProfile?.name}</span>
            <span className="uppercase text-xs font-light">
              {currentProfile?.db_type}
            </span>
          </div>
          <Button onClick={disconnectDatabase}>Disconnect</Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default DatabaseSidebar;
