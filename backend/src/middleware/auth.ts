import Elysia from "elysia";

import { unauthorizedError } from "../error";
import { createAuthTokens } from "../modules/auth/auth.service";

type AuthPayload = {
  userId: string;
  username: string;
  role: string | null;
  organizationId: string | null;
};

type JwtPlugin = {
  sign: (payload: Record<string, unknown>) => Promise<string>;
  verify: (token: string) => Promise<AuthPayload | false>;
};

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

export const requireAuthenticatedUser = async (context: any) => {
  const { accessJwt, refreshJwt, cookie } = context;

  const accessToken = cookie.accessToken.value as string | undefined;
  if (accessToken) {
    try {
      const payload = await (accessJwt as JwtPlugin).verify(accessToken);
      if (payload) {
        return payload;
      }
    } catch {}
  }

  const refreshToken = cookie.refreshToken.value as string | undefined;
  if (refreshToken) {
    try {
      const payload = await (refreshJwt as JwtPlugin).verify(refreshToken);
      if (payload) {
        const tokens = await createAuthTokens(
          {
            id: payload.userId,
            username: payload.username,
            role: payload.role,
            organizationId: payload.organizationId,
          },
          accessJwt as JwtPlugin,
          refreshJwt as JwtPlugin,
        );
        cookie.accessToken.set({
          ...accessCookieOptions,
          value: tokens.accessToken,
        });
        cookie.refreshToken.set({
          ...refreshCookieOptions,
          value: tokens.refreshToken,
        });
        return payload;
      }
    } catch {}
  }

  throw new unauthorizedError("Unauthorized");
};

export const authGuard = new Elysia({ name: "auth-guard" }).derive(
  ///derive:Before the route runs, calculate some values and attach them to the context.
  async (context: any) => {
    const auth = await requireAuthenticatedUser(context);
    return { auth };
  },
);
