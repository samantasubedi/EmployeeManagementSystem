import { conflictError, forbiddenError, notFoundError } from "../../../error";
import { organizationRepository } from "../repository/organization.repository";

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
    const existingOrganization =
      await organizationRepository.findOrganizationBySlug(slug);
    if (existingOrganization) {
      throw new conflictError("slug already exists");
    }
    return organizationRepository.createOrganization({
      name,
      slug,
      description,
      ownerId,
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
