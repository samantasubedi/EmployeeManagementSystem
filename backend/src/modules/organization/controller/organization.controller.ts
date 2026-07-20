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
  edit: async (ctx: any) => {
    const currentUserId =""

    const result = await organizationService.edit({
      organizationId: ctx.params.id,
      currentUserId,
      ...ctx.body,
    });

    ctx.set.status = 200;
    return {
      message: "organization updated successfully",
      details: result,
    };
  },
};
