import { userService } from "./user.service";

export const userController = {
  listByOrganization: async (ctx: any) => {
    const result = await userService.getOrganizationUsers({
      organizationId: ctx.auth.organizationId,
      requesterId: ctx.auth.userId,
    });

    ctx.set.status = 200;
    return {
      message: "organization users fetched successfully",
      details: result,
    };
  },
  create: async (ctx: any) => {
    const result = await userService.createOrganizationUser({
      organizationId: ctx.auth.organizationId,
      requesterId: ctx.auth.userId,
      ...ctx.body,
    });

    ctx.set.status = 201;
    return {
      message: "user created successfully",
      details: result,
    };
  },
  edit: async (ctx: any) => {
    const result = await userService.editOrganizationUser({
      organizationId: ctx.auth.organizationId,
      requesterId: ctx.auth.userId,
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
