import { createContext, useContext, useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { DatabaseClient } from "@/lib/DatabaseClient";
import { createDatabaseClient } from "@/lib/utils";

// Define the context type
interface AppContextType {
  dbClient: DatabaseClient | null;
  tables: string[];
  profiles: DatabaseProfile[];
  currentProfile: DatabaseProfile | null;
  fetchingProfiles: boolean;
  setCurrentProfile: (profile: DatabaseProfile | null) => void;
  connectToDatabase: (
    type: "sqlite" | "postgres" | "mysql",
    connectionString: string
  ) => Promise<void>;
  disconnectDatabase: () => void;
  fetchTables: () => Promise<void>;
  fetchProfiles: () => Promise<void>;
  saveProfile: (profile: Omit<DatabaseProfile, "id">) => Promise<void>;
  deleteProfile: (id: number) => Promise<void>;
}

export interface DatabaseProfile {
  id: number;
  name: string;
  host: string;
  db_type: "mysql" | "postgres" | "sqlite";
  default_database: string;
  user: string;
  password: string;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [dbClient, setDbClient] = useState<DatabaseClient | null>(null);
  const [tables, setTables] = useState<string[]>([]);
  const [profiles, setProfiles] = useState<DatabaseProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<DatabaseProfile | null>(null);
  const [fetchingProfiles, setFetchingProfiles] = useState<boolean>(false);

  const initInternalDb = async () => {
    try {
      await invoke("init_internal_db");
    }
    catch(error) {
      console.log(error);
      toast.error("Failed to initialize internal database: " + error);
    }
  };
  useEffect(() => {
    initInternalDb();
    fetchProfiles();
  }, []);


  const fetchProfiles = async () => {
    setFetchingProfiles(true);
    try {
      const result: DatabaseProfile[] = await invoke("fetch_profiles");
      setProfiles(result);
    } catch (error) {
      throw error;
    } finally {
      setFetchingProfiles(false);
    }
  };

  const saveProfile = async (profile: Omit<DatabaseProfile, "id">) => {
    try {
      await invoke("save_profile", { profile: {id: 0, ...profile} });
      fetchProfiles(); // Refresh after saving
    } catch (error) {
      toast.error("Failed to save profile: " + error);
    }
  };

  const deleteProfile = async (id: number) => {
    try {
      await invoke("delete_profile", { profile_id: id });
      fetchProfiles();
    } catch (error) {
      toast.error("Failed to delete profile: " + error);
    }
  };

   const connectToDatabase = async (type: "sqlite" | "postgres" | "mysql", connectionString: string) => {
    if (dbClient) {
      await dbClient.disconnect(); // Close any existing connection
      setTables([])
    }
    try {
      const client = createDatabaseClient(type, connectionString);
      await client.connect();
      setDbClient(client);
      toast.success("Connected to database");
    } catch (error) {
      toast.error("Connection failed: " + error);
    }
  };

   const disconnectDatabase = async () => {
    if (dbClient) {
      await dbClient.disconnect();
      setDbClient(null);
      setTables([]);
      setCurrentProfile(null);
    }
  };

    const fetchTables = async () => {
    if (!dbClient) return;
   try {
     const tables = await dbClient.fetchTables();
      setTables(tables);
   }
   catch(error) {
    console.log(error);
    toast.error( "Failed to fetch tables: " + error);
   }
  };

  return (
    <AppContext.Provider
      value={{
        dbClient,
        tables,
        profiles,
        fetchingProfiles,
        connectToDatabase,
        disconnectDatabase,
        fetchTables,
        fetchProfiles,
        currentProfile,
        setCurrentProfile,
        saveProfile,
        deleteProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within an AppProvider");
  return context;
};
