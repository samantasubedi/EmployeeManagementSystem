import { organizationService } from "./organization.service";
import { requireAuthenticatedUser } from "../../middleware/auth";

export const organizationController = {
  create: async (ctx: any) => {
    const auth = await requireAuthenticatedUser(ctx);
    const result = await organizationService.create({
      ...ctx.body,
      ownerId: auth.userId,
    });
    ctx.set.status = 201;
    return {
      message: "organization created successfully",
      details: result,
    };
  },
  edit: async (ctx: any) => {
    const currentUserId = (await requireAuthenticatedUser(ctx)).userId;

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
