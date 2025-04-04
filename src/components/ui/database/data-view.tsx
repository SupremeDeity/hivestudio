import { Key, Loader2 } from "lucide-react";
import { DataTable } from "./data-table";
import { useTableData } from "./use-table-data";
import { cn } from "@/lib/utils";

function Cell({ value }: { value: unknown }) {
  const pVal = value === null ? "(NULL)" : String(value);
  return (
    <span title={pVal} className={value === null ? "text-muted-foreground" : ""}>
      {pVal}
    </span>
  );
}

function DataView({ tableName }: { tableName: string }) {
  const { columns, rows, loading } = useTableData(tableName);

  if (loading) return <div className="flex justify-center items-center w-full h-full"><Loader2 className="animate-spin"/></div>;
  if (!tableName) return <p>Select a table</p>;

  const tableColumns = columns.map((col) => ({
    accessorKey: col.name,
    header: () => (
      <div
        title={`${col.name} ${col.type} ${col.is_primary ? "[PRIMARY]" : ""}${
          col.is_unique ? "[UNIQUE]" : ""
        }${
          col.is_foreign ? `-> ${col.foreign_table}(${col.foreign_column})` : ""
        }`}
        className="flex gap-2 items-center"
      >
        {(col.is_primary || col.is_foreign) && (
          <Key
            className={cn("size-4", {
              "text-primary": col.is_primary,
              "text-sidebar-accent": col.is_foreign,
            })}
          />
        )}
        <span className="font-semibold">{col.name}</span>
        <span className="text-muted-foreground text-xs">({col.type})</span>
      </div>
    ),
    cell: ({ getValue }: { getValue: () => unknown }) => (
      <Cell value={getValue()} />
    ),
  }));

  const columnsWithIndex = [
    {
      id: "index",
      header: "",
      cell: ({ row }: { row: any }) => (
        <div className="text-center">{row.index + 1}</div>
      ),
      size: 40,
    },
    ...tableColumns,
  ];

  return <DataTable columns={columnsWithIndex} data={rows} />;
}

export default DataView;
