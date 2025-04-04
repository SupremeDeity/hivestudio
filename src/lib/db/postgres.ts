import { DatabaseClient, TableSchema } from "../DatabaseClient";

export class PostgresClient extends DatabaseClient {
  async fetchTables(): Promise<string[]> {
    const query =
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public';";
    const result = await this.selectQuery(query);
    return result.map((row: any) => row.table_name);
  }

  async fetchDatabases(): Promise<string[]> {
    const query =
      "SELECT datname FROM pg_database WHERE datistemplate = false;";
    const result = await this.selectQuery(query);
    return result.map((row: any) => row.datname);
  }

  async fetchTableSchema(tableName: string): Promise<TableSchema[]> {
    const query = `
SELECT 
  c.column_name AS name,
  CASE 
    WHEN c.data_type = 'USER-DEFINED' THEN t.typname
    WHEN c.data_type = 'timestamp without time zone' THEN 'timestamp'
    WHEN c.data_type = 'timestamp with time zone' THEN 'timestamptz'
    ELSE c.data_type
  END AS type,
  c.column_default AS dflt_value,
  c.is_nullable = 'YES' AS is_nullable,
  string_agg(DISTINCT tc.constraint_type, ',') AS constraint_types,
  cu.table_name AS foreign_table,
  cu.column_name AS foreign_column
FROM information_schema.columns c
LEFT JOIN pg_type t ON c.udt_name = t.typname
LEFT JOIN information_schema.key_column_usage kcu 
  ON c.table_name = kcu.table_name 
  AND c.column_name = kcu.column_name
LEFT JOIN information_schema.table_constraints tc 
  ON tc.constraint_name = kcu.constraint_name 
  AND tc.table_name = c.table_name
LEFT JOIN information_schema.referential_constraints rc
  ON rc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage cu
  ON cu.constraint_name = rc.unique_constraint_name
WHERE c.table_name = $1
GROUP BY 
  c.column_name, c.data_type, t.typname, c.column_default, c.is_nullable,
  cu.table_name, cu.column_name, c.ordinal_position
ORDER BY c.ordinal_position;
`;

    const columns = await this.selectQuery(query, [tableName]);
    return columns.map((col: any) => {
      const constraints = (col.constraint_types || "").split(",");

      return {
        name: col.name,
        type: col.type,
        dflt_value: col.dflt_value,
        is_nullable: col.is_nullable,
        is_primary: constraints.includes("PRIMARY KEY"),
        is_foreign: constraints.includes("FOREIGN KEY"),
        is_unique: constraints.includes("UNIQUE"),
        foreign_table: constraints.includes("FOREIGN KEY")
          ? col.foreign_table
          : undefined,
        foreign_column: constraints.includes("FOREIGN KEY")
          ? col.foreign_column
          : undefined,
      };
    });
  }

  async fetchTableData(tableName: string, limit: number = 100): Promise<any[]> {
    // Get column information first
    const columns = await this.selectQuery(
      `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = $1
    `,
      [tableName]
    );

    // Build a SELECT with type casting for custom types
    const selectList = columns
      .map((col: any) => {
        if (col.data_type === "USER-DEFINED" || col.data_type === "numeric") {
          return `"${col.column_name}"::text AS "${col.column_name}"`;
        }
        return `"${col.column_name}"`;
      })
      .join(", ");

    return await this.selectQuery(
      `SELECT ${selectList} FROM "${tableName}" LIMIT $1;`,
      [limit]
    );
  }
}
