import { useAppContext } from "@/context/AppContext";
import { Loader2Icon, TableIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SidebarMenuButton, SidebarMenuItem } from "../sidebar";

function DatabaseTablesView() {
  const [isFetching, setIsFetching] = useState(true);
  const { fetchTables, tables, dbClient } = useAppContext();

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
            <SidebarMenuButton>
              <TableIcon className="size-4" /> {table}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
    </>
  );
}

export default DatabaseTablesView;
