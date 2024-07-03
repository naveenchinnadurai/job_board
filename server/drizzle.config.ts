import { type Config } from "drizzle-kit";
import dotenv from "dotenv";
import { DATABASE_URL } from "./src/constants/env";

dotenv.config;

if (!DATABASE_URL) {
  console.log("🔴 Cannot find database url");
}

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL! || "",
  },
} satisfies Config;
