import { pgEnum, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
export const roleEnum = pgEnum("role", ["employee", "manager", "admin"]);
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  hashedPassword: text("hashedPassword").notNull(),
  role: roleEnum("role"),
  description: text("description"),
});
