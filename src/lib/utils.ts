import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DatabaseClient } from "./DatabaseClient";
import { PostgresClient } from "./db/postgres";
import { MySQLClient } from "./db/mysql";
import { SQLiteClient } from "./db/sqlite";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getConnectionString(values: any) {
  switch (values.db_type) {
    case "postgres":
      return `postgres://${values.user}:${values.password}@${values.host}:${values.port}/${values.default_database}`;
    case "mysql":
      return `mysql://${values.user}:${values.password}@${values.host}:${values.port}/${values.default_database}`;
    default:
      return "";
  }
}

export function createDatabaseClient(
  dbType: "sqlite" | "postgres" | "mysql",
  dbPath: string
): DatabaseClient {
  switch (dbType) {
    case "sqlite":
      return new SQLiteClient(dbType, dbPath);
    case "postgres":
      return new PostgresClient(dbType, dbPath);
    case "mysql":
      return new MySQLClient(dbType, dbPath);
    default:
      throw new Error("Unsupported database type");
  }
}
