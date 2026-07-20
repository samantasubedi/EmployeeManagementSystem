import { eq } from "drizzle-orm";
import { db } from "../../../database/client";
import { organizations, users } from "../../../database/schema";

export const organizationRepository = {
  createOrganization: (payload: {
    name: string;
    slug: string;
    description?: string | null;
    ownerId: string;
  }) => {
    return db
      .insert(organizations)
      .values(payload)
      .returning()
      .then((rows) => {
        return rows[0];
      });
  },
  findUserById: (id: string) => {
    return db.query.users.findFirst({ where: eq(users.id, id) });
  },
  findOrganizationBySlug: (slug: string) => {
    return db.query.organizations.findFirst({
      where: eq(organizations.slug, slug),
    });
  },
};
