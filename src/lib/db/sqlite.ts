import { DatabaseClient, TableSchema } from "../DatabaseClient";

export class SQLiteClient extends DatabaseClient {
  async fetchTables(): Promise<string[]> {
    const query = "SELECT name FROM sqlite_master WHERE type='table';";
    const result = await this.selectQuery(query);
    return result.map((row: any) => row.name);
  }

  async fetchTableSchema(tableName: string): Promise<TableSchema[]> {
  const columns = await this.selectQuery(`PRAGMA table_info(${tableName});`);
  return columns.map((col: any) => ({
    name: col.name,
    type: col.type,
    dflt_value: col.dflt_value,
    is_nullable: col.notnull === 0, // SQLite uses 0 for nullable, 1 for not nullable
    is_primary: col.pk === 1, // 1 means primary key
  }));
}
  async fetchTableData(tableName: string, limit: number = 100): Promise<any[]> {
    return await this.selectQuery(`SELECT * FROM ${tableName} LIMIT ${limit};`);
  }
}