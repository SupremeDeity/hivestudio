import { DatabaseClient } from "../DatabaseClient";

export class MySQLClient extends DatabaseClient {
  async fetchTables(): Promise<string[]> {
    const query = "SHOW TABLES;";
    const result = await this.selectQuery(query);
    return result.map((row) => Object.values(row)[0]); // Extract table name
  }

  async fetchDatabases(): Promise<string[]> {
    const query = "SHOW DATABASES;";
    const result = await this.selectQuery(query);
    return result.map((row) => Object.values(row)[0]); // Extract database name
  }
}
