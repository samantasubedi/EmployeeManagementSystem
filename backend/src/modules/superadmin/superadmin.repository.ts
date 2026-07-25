import { db } from "../../database/client";

export const superadminRepository = {
  getAllOrganizations: async () => {
    return db.query.organizations.findMany();
  },
};
