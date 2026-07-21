import { eq } from "drizzle-orm";

import { conflictError, forbiddenError, notFoundError } from "../../error";
import { db } from "../../database/client";
import { organizations, users } from "../../database/schema";
import { organizationRepository } from "./organization.repository";

export const organizationService = {
  create: async ({
    name,
    slug,
    description,
    ownerId,
  }: {
    name: string;
    slug: string;
    description?: string;
    ownerId: string;
  }) => {
    const owner = await organizationRepository.findUserById(ownerId);
    if (!owner) {
      throw new notFoundError("owner not found");
    }
    if (owner.organizationId) {
      throw new conflictError("already enrolled in a company");
    }
    const ownedOrganization =
      await organizationRepository.findOrganizationByOwnerId(ownerId);
    if (ownedOrganization) {
      throw new conflictError("already enrolled in a company");
    }
    const existingOrganization =
      await organizationRepository.findOrganizationBySlug(slug);
    if (existingOrganization) {
      throw new conflictError("slug already exists");
    }

    return db.transaction(async (tx) => {
      const [organization] = await tx
        .insert(organizations)
        .values({
          name,
          slug,
          description,
          ownerId,
        })
        .returning();

      await tx
        .update(users)
        .set({ organizationId: organization.id })
        .where(eq(users.id, ownerId));

      return organization;
    });
  },
  edit: async ({
    organizationId,
    currentUserId,
    name,
    slug,
    description,
  }: {
    organizationId: string;
    currentUserId: string;
    name?: string;
    slug?: string;
    description?: string | null;
  }) => {
    const organization =
      await organizationRepository.findOrganizationById(organizationId);

    if (!organization) {
      throw new notFoundError("organization not found");
    }

    if (organization.ownerId !== currentUserId) {
      throw new forbiddenError("only owner can edit this organization");
    }

    if (slug) {
      const duplicateSlug =
        await organizationRepository.findOrganizationBySlugExcludingId(
          slug,
          organizationId,
        );

      if (duplicateSlug) {
        throw new conflictError("slug already exists");
      }
    }

    return organizationRepository.updateOrganization(organizationId, {
      name,
      slug,
      description,
    });
  },
};
