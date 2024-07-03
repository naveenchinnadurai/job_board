import { drizzle } from "drizzle-orm/postgres-js";
// import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import dotenv from "dotenv";

import * as schema from "./schema";

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.log("🔴 Cannot find database url");
}

const client = postgres(process.env.DATABASE_URL as string, { max: 1 });
const db = drizzle(client, { schema: schema, logger: true });

// const migrateDB = async () => {
//   try {
//     console.log("🟠 Migrating client");
//     await migrate(db, { migrationsFolder: "./migrations" });
//     console.log("🟢 Successfully migrated");
//   } catch (error) {
//     console.log("🔴 Error migrating client", error);
//   }
// };
// migrateDB();

export default db;
