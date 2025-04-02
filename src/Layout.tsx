import { Outlet, useNavigate } from "react-router";
import { Button } from "./components/ui/button";
import { RefreshCcw } from "lucide-react";
import ProfileSelector from "./components/ui/profile-selector";

import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";
import AddConnection from "./components/ui/add-connection";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import AppSidebar from "./components/ui/main/app-sidebar";

function AppLayout() {
  const navigate = useNavigate();
  const { fetchProfiles, fetchingProfiles, dbClient } = useAppContext();

  useEffect(() => {
    if (dbClient) {
      navigate("/database");
    }
  }, [dbClient]);

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="w-full p-2">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default AppLayout;
