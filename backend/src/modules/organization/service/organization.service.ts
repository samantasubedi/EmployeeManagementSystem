import { conflictError, notFoundError } from "../../../error";
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
};
