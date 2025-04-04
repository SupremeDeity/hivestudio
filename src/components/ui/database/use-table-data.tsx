import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { TableSchema } from "@/lib/DatabaseClient";

export function useTableData(tableName: string) {
  const { dbClient } = useAppContext();
  const [columns, setColumns] = useState<TableSchema[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dbClient || !tableName) return;

    async function fetchData() {
      if (!dbClient) return;
      setLoading(true);
      try {
        const cols = await dbClient.fetchTableSchema(tableName);
        const data = await dbClient.fetchTableData(tableName);
        setColumns(cols);
        setRows(data);
      } catch (error) {
        console.error("Error fetching table data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [dbClient, tableName]);

  return { columns, rows, loading };
}
