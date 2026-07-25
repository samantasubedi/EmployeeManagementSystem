import { eq } from "drizzle-orm";
import { db } from "../../database/client";
import { organizations } from "../../database/schema";

export const superadminRepository = {
  getAllOrganizations: async () => {
    return db.query.organizations.findMany();
  },
  findOrganizationBySlug: async (slug: string) => {
    return db.query.organizations.findFirst({
      where: eq(organizations.slug, slug),
    });
  },
};

