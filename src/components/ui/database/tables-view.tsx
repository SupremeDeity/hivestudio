import { useAppContext } from "@/context/AppContext";
import { Loader2Icon, TableIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SidebarMenuButton, SidebarMenuItem } from "../sidebar";
import { useTabContext } from "@/context/database/TabContext";

function DatabaseTablesView() {
  const [isFetching, setIsFetching] = useState(true);
  const { fetchTables, tables, dbClient } = useAppContext();
  const { addTab, activeTab } = useTabContext();

  useEffect(() => {
    async function _fetchTables() {
      try {
        setIsFetching(true);
        await fetchTables();
      } catch (e) {
        toast("Error: " + e);
      } finally {
        setIsFetching(false);
      }
    }

    _fetchTables();
  }, [dbClient]);

  return (
    <>
      {isFetching && <Loader2Icon className="animate-spin" />}
      {...tables.map((table) => (
        <SidebarMenuItem>
          <SidebarMenuButton
            isActive={activeTab === table}
            onDoubleClick={() => {
              addTab(table);
            }}
          >
            <TableIcon className="size-4" /> {table}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}

export default DatabaseTablesView;
