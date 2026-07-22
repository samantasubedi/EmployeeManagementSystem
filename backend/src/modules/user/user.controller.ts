import { userService } from "./user.service";
import { requireAuthenticatedUser } from "../../middleware/auth";

export const userController = {
  listByOrganization: async (ctx: any) => {
    const auth = await requireAuthenticatedUser(ctx);

    const result = await userService.getOrganizationUsers({
      organizationId: auth.organizationId,
      requesterId: auth.userId,
    });

    ctx.set.status = 200;
    return {
      message: "organization users fetched successfully",
      details: result,
    };
  },
  create: async (ctx: any) => {
    const auth = await requireAuthenticatedUser(ctx);

    const result = await userService.createOrganizationUser({
      organizationId: auth.organizationId,
      requesterId: auth.userId,
      ...ctx.body,
    });

    ctx.set.status = 201;
    return {
      message: "user created successfully",
      details: result,
    };
  },
  edit: async (ctx: any) => {
    const auth = await requireAuthenticatedUser(ctx);

    const result = await userService.editOrganizationUser({
      organizationId: auth.organizationId,
      requesterId: auth.userId,
      userId: ctx.params.userId,
      ...ctx.body,
    });

    ctx.set.status = 200;
    return {
      message: "user updated successfully",
      details: result,
    };
  },
};
