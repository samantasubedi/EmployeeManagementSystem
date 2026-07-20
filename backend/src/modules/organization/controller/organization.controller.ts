import { organizationService } from "../service/organization.service";

export const organizationController = {
  create: async (ctx: any) => {
    const result = await organizationService.create(ctx.body);
    ctx.set.status = 201;
    return {
      message: "organization created successfully",
      details: result,
    };
  },
};
