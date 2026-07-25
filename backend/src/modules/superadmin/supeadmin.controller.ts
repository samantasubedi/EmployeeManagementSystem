import { superadminService } from "./superadmin.service";

export const superadminController = {
  login: async (ctx: any) => {
    const result = await superadminService.login({
      ...ctx.body,
      accessJwt: ctx.accessJwt,
      refreshJwt: ctx.refreshJwt,
    })
    return{ result }
  },
  getOrganziationInfo: async (ctx: any) => {
    const organizations = await superadminService.getOrganizationInfo();
    return { organizations };
  },
  suspendOrganization: async (ctx: any) => {
    const result = await superadminService.suspendOrganization(
      ctx.body.organizationSlug
    );
    return { result };
  },
  reactivateOrganization: () => {},
};
