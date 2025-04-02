import { useAppContext } from "@/context/AppContext";
import { getConnectionString } from "@/lib/utils";
import { SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from "./sidebar";
import { Database } from "lucide-react";

function ProfileSelector() {
  const { connectToDatabase, profiles, setCurrentProfile } = useAppContext();
  return (
    <>
      {profiles.map((profile) => (
        <SidebarMenuItem key={profile.id}>
          
          <SidebarMenuButton
            key={profile.id}
            onDoubleClick={() => {
              setCurrentProfile(profile);
              connectToDatabase(
                profile.db_type as "mysql" | "postgres" | "sqlite",
                getConnectionString(profile)
              );
            }}
          >
            <Database /> <span>{profile.name}</span>
          </SidebarMenuButton>
          <SidebarMenuBadge>{profile.db_type}</SidebarMenuBadge>
        </SidebarMenuItem>
      ))}
    </>
  );
}
export default ProfileSelector;
