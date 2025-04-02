import Database from "@tauri-apps/plugin-sql";

export class DatabaseClient {
  protected db: Database | null = null;
  protected dbPath: string;
  protected dbType: "sqlite" | "postgres" | "mysql";

  constructor(dbType: "sqlite" | "postgres" | "mysql", dbPath: string) {
    this.dbType = dbType;
    this.dbPath = dbPath;
  }

  async connect() {
    if (this.db) return; // Already connected

    this.db = await Database.load(this.dbPath);
  }

  async disconnect() {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }

  async fetchTables(): Promise<string[]> {
    throw new Error("fetchTables() must be implemented in subclass");
  }

  async fetchDatabases(): Promise<string[]> {
    throw new Error("fetchDatabases() must be implemented in subclass");
  }

  protected async executeQuery(query: string): Promise<any> {
    if (!this.db) throw new Error("Database is not connected");
    return this.db.execute(query);
  }

  protected async selectQuery(query: string): Promise<any> {
    if (!this.db) throw new Error("Database is not connected");
    return this.db.select(query);
  }
}
