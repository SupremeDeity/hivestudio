import { Outlet, useNavigate } from "react-router";
import { useAppContext } from "./context/AppContext";
import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import DatabaseSidebar from "./components/ui/database/database-sidebar";

function DatabaseLayout() {
  const navigate = useNavigate();
  const { dbClient} = useAppContext();

  useEffect(() => {
    if (!dbClient) {
      navigate("/");
    }
  }, [dbClient]);

  return (
    <SidebarProvider>
      <DatabaseSidebar />
      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default DatabaseLayout;
