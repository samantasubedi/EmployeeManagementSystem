import { authService } from "../service/auth.service";

export const authController = {
  register: async (ctx: any) => {
    const result = await authService.register({
      ...ctx.body,
      accessJwt: ctx.accessJwt,
      refreshJwt: ctx.refreshJwt,
    });
    ctx.set.status = 201;
    ctx.cookie.accessToken.set({
      value: result.accessToken,
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 15,
    });
    ctx.cookie.refreshToken.set({
      value: result.refreshToken,
      sameSite: "strict",
      htttpOnly: true,
      maxAge: 60 * 60 * 24 * 15,
    });
    return { message: "user registered successfully", details: result };
  },
  login: async (ctx: any) => {
    const result = await authService.login({
      ...ctx.body,
      accessJwt: ctx.accessJwt,
      refreshJwt: ctx.refreshJwt,
    });
    ctx.set.status = 200;
    ctx.cookie.accessToken.set({
      value: result.accessToken,
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 15,
    });
    ctx.cookie.refreshToken.set({
      value: result.refreshToken,
      sameSite: "strict",
      htttpOnly: true,
      maxAge: 60 * 60 * 24 * 15,
    });
    return { message: "log in successfull", details: result };
  },
};
