import { eq } from "drizzle-orm";
import { db } from "../../database/client";
import { organizations, users } from "../../database/schema";

export const authRepository = {
  handleRegister: (payload: {
    email: string;
    username: string;
    hashedPassword: string;
  }) => {
    return db
      .insert(users)
      .values(payload)
      .returning()
      .then((rows) => {
        return rows[0];
      });
  },
  findUserByEmail: (email: string) => {
    return db.query.users.findFirst({ where: eq(users.email, email) });
  },
  findUserById: (id: string) => {
    return db.query.users.findFirst({ where: eq(users.id, id) });
  },
  findUserByUsername: (username: string) => {
    return db.query.users.findFirst({ where: eq(users.username, username) });
  },
  findOrganizationByOwnerId: (ownerId: string) => {
    return db.query.organizations.findFirst({
      where: eq(organizations.ownerId, ownerId),
    });
  },
  updateUserRole: (userId: string, role: "employee" | "manager" | "admin") => {
    return db
      .update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .returning()
      .then((rows) => rows[0]);
  },
};
