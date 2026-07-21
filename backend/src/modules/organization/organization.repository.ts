import { eq } from "drizzle-orm";
import { db } from "../../database/client";
import { organizations, users } from "../../database/schema";

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
  updateUserOrganizationId: (userId: string, organizationId: string | null) => {
    return db
      .update(users)
      .set({ organizationId })
      .where(eq(users.id, userId))
      .returning()
      .then((rows) => rows[0]);
  },
  findUserById: (id: string) => {
    return db.query.users.findFirst({ where: eq(users.id, id) });
  },
  findOrganizationByOwnerId: (ownerId: string) => {
    return db.query.organizations.findFirst({
      where: eq(organizations.ownerId, ownerId),
    });
  },
  findOrganizationBySlug: (slug: string) => {
    return db.query.organizations.findFirst({
      where: eq(organizations.slug, slug),
    });
  },
  findOrganizationById: (id: string) => {
    return db.query.organizations.findFirst({
      where: eq(organizations.id, id),
    });
  },
  findOrganizationBySlugExcludingId: (slug: string, id: string) => {
    return db.query.organizations.findFirst({
      where: (organizationsTable, { and, eq, ne }) =>
        and(eq(organizationsTable.slug, slug), ne(organizationsTable.id, id)),
    });
  },
  updateOrganization: (
    id: string,
    payload: Partial<{
      name: string;
      slug: string;
      description: string | null;
    }>,
  ) => {
    return db
      .update(organizations)
      .set(payload)
      .where(eq(organizations.id, id))
      .returning()
      .then((rows) => rows[0]);
  },
};
