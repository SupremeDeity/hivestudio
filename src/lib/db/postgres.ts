import { DatabaseClient } from "../DatabaseClient";

export class PostgresClient extends DatabaseClient {
  async fetchTables(): Promise<string[]> {
    const query =
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public';";
    const result = await this.selectQuery(query);
    return result.map(row => row.table_name);
  }

  async fetchDatabases(): Promise<string[]> {
     console.log("changed")
    const query = "SELECT datname FROM pg_database WHERE datistemplate = false;";
    const result = await this.selectQuery(query);
    return result.map(row => row.datname);
  }
}