import { DatabaseClient } from "../DatabaseClient";

export class SQLiteClient extends DatabaseClient {
  async fetchTables(): Promise<string[]> {
    const query = "SELECT name FROM sqlite_master WHERE type='table';";
    const result = await this.selectQuery(query);
    return result.map(row => row.name);
  }
}