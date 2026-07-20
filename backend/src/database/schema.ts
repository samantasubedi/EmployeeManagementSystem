import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
export const roleEnum = pgEnum("role", ["employee", "manager", "admin"]);
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  hashedPassword: text("hashedPassword").notNull(),
  role: roleEnum("role"),
  description: text("description"),
  organizationId: uuid("organizationId").references(() => organizations.id),
});
export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  ownerId: uuid("ownerId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
