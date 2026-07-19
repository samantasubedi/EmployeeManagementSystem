import { defineConfig } from "drizzle-kit";
import "dotenv/config"
export default defineConfig({
  dialect: "postgresql",
  out: "./migration",
  schema:"./src/database/schema.ts",
  dbCredentials:{url:process.env.DATABASE_URL!}
});
