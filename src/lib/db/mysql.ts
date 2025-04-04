import { DatabaseClient, TableSchema } from "../DatabaseClient";

export class MySQLClient extends DatabaseClient {
  async fetchTables(): Promise<string[]> {
    const query = "SHOW TABLES;";
    const result = await this.selectQuery(query);
    return result.map((row: any) => Object.values(row)[0]); // Extract table name
  }

  async fetchDatabases(): Promise<string[]> {
    const query = "SHOW DATABASES;";
    const result = await this.selectQuery(query);
    return result.map((row: any) => Object.values(row)[0]); // Extract database name
  }

  async fetchTableSchema(tableName: string): Promise<TableSchema[]> {
    const columns = await this.selectQuery(`
    SELECT COLUMN_NAME AS name, COLUMN_TYPE AS type, COLUMN_DEFAULT AS dflt_value, 
           IS_NULLABLE = 'YES' AS is_nullable, COLUMN_KEY = 'PRI' AS is_primary
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = '${tableName}';
  `);
    return columns.map((col: any) => ({
      name: col.name,
      type: col.type,
      dflt_value: col.dflt_value,
      is_nullable: col.is_nullable,
      is_primary: col.is_primary,
    }));
  }

  async fetchTableData(tableName: string, limit: number = 100): Promise<any[]> {
    return await this.selectQuery(`SELECT * FROM ${tableName} LIMIT ?;`, [
      limit,
    ]);
  }
}
