import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { getConnectionString } from "@/lib/utils";
import { useEffect, useState } from "react";

function DatabasesView() {
  const { currentProfile, dbClient, connectToDatabase } = useAppContext();
  const [databases, setDatabases] = useState<string[]>([]);
  useEffect(() => {
    async function getDbs() {
      if (!dbClient) return;
      const dbs = await dbClient?.fetchDatabases();
      setDatabases(dbs);
    }
    getDbs();
  }, []);

  function changeDb(db: string) {
    connectToDatabase(currentProfile!.db_type, getConnectionString({...currentProfile, default_database: db}))
  }

  return (
    <Select onValueChange={changeDb} defaultValue={currentProfile?.default_database}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Loading.." />
      </SelectTrigger>
      <SelectContent>
        {databases.map((d) => (
          <SelectItem key={d} value={d}>{d}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default DatabasesView;
