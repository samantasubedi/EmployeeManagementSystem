import { organizationService } from "./organization.service";
import { requireAuthenticatedUser } from "../../middleware/auth";
import { organizationRepository } from "./organization.repository";
import { createAuthTokens } from "../auth/auth.service";

const accessCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  path: "/",
  maxAge: 60 * 15,
};

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 15,
};

export const organizationController = {
  create: async (ctx: any) => {
    const auth = await requireAuthenticatedUser(ctx);
    const result = await organizationService.create({
      ...ctx.body,
      ownerId: auth.userId,
    });

    const refreshedUser = await organizationRepository.findUserById(
      auth.userId,
    );
    if (refreshedUser) {
      const tokens = await createAuthTokens(
        {
          id: refreshedUser.id,
          username: refreshedUser.username,
          role: refreshedUser.role,
          organizationId: refreshedUser.organizationId,
        },
        ctx.accessJwt,
        ctx.refreshJwt,
      );

      ctx.cookie.accessToken.set({
        ...accessCookieOptions,
        value: tokens.accessToken,
      });
      ctx.cookie.refreshToken.set({
        ...refreshCookieOptions,
        value: tokens.refreshToken,
      });
    }

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
