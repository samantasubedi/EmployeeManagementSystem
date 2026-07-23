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
  getOrganziationInfo:async (ctx:any) => {

  
  },
  suspendOrganization: () => {},
  reactivateOrganization: () => {},
};
