import { and, eq, ne } from "drizzle-orm";

import { db } from "../../database/client";
import { organizations, users } from "../../database/schema";

const organizationUserSelect = {
  id: users.id,
  username: users.username,
  email: users.email,
  role: users.role,
  description: users.description,
  organizationId: users.organizationId,
};

export const userRepository = {
  findOrganizationById: (organizationId: string) => {
    return db.query.organizations.findFirst({
      where: eq(organizations.id, organizationId),
    });
  },
  findUserById: (userId: string) => {
    return db.query.users.findFirst({ where: eq(users.id, userId) });
  },
  findOrganizationUserById: (organizationId: string, userId: string) => {
    return db
      .select(organizationUserSelect)
      .from(users)
      .where(
        and(eq(users.id, userId), eq(users.organizationId, organizationId)),
      )
      .then((rows) => rows[0]);
  },
  findOrganizationUsers: (organizationId: string) => {
    return db
      .select(organizationUserSelect)
      .from(users)
      .where(eq(users.organizationId, organizationId))
      .orderBy(users.username);
  },
  findUserByEmail: (email: string) => {
    return db.query.users.findFirst({ where: eq(users.email, email) });
  },
  findUserByUsername: (username: string) => {
    return db.query.users.findFirst({ where: eq(users.username, username) });
  },
  findUserByEmailExcludingId: (email: string, userId: string) => {
    return db.query.users.findFirst({
      where: and(eq(users.email, email), ne(users.id, userId)),
    });
  },
  findUserByUsernameExcludingId: (username: string, userId: string) => {
    return db.query.users.findFirst({
      where: and(eq(users.username, username), ne(users.id, userId)),
    });
  },
  createOrganizationUser: (payload: {
    username: string;
    email: string;
    hashedPassword: string;
    role: "employee" | "manager" | "admin";
    description?: string | null;
    organizationId: string;
  }) => {
    return db
      .insert(users)
      .values(payload)
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        description: users.description,
        organizationId: users.organizationId,
      })
      .then((rows) => rows[0]);
  },
  updateOrganizationUser: (
    organizationId: string,
    userId: string,
    payload: Partial<{
      username: string;
      email: string;
      role: "employee" | "manager" | "admin";
      description: string | null;
    }>,
  ) => {
    return db
      .update(users)
      .set(payload)
      .where(
        and(eq(users.id, userId), eq(users.organizationId, organizationId)),
      )
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        description: users.description,
        organizationId: users.organizationId,
      })
      .then((rows) => rows[0]);
  },
};
