import { authService } from "../service/auth.service";

export const authController = {
  register: async (ctx: any) => {
    const result = await authService.register(ctx.body);
    ctx.set.status = 201;
    return { message: "user registered successfully", details: result };
  },
  login: async (ctx: any) => {
    const result = await authService.login(ctx.body);
    ctx.set.status = 200;
    return { message: "log in successfull", details:result };
  },
};
