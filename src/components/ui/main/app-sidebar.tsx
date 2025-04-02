import {
  Calendar,
  Home,
  Inbox,
  RefreshCcw,
  Search,
  Settings,
} from "lucide-react";
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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../sidebar";
import AddConnection from "../add-connection";
import { Button } from "../button";
import { useAppContext } from "@/context/AppContext";
import ProfileSelector from "../profile-selector";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

function AppSidebar() {
  const { fetchProfiles, fetchingProfiles } = useAppContext();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex gap-4 items-center justify-center w-full">
          <AddConnection />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Profiles</SidebarGroupLabel>
          
          <SidebarGroupAction
            disabled={fetchingProfiles}
            onClick={fetchProfiles}
            title="Refresh"
          >
            <RefreshCcw className={cn(fetchingProfiles && "animate-spin")} />{" "}
            <span className="sr-only">Refresh</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <ProfileSelector />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
