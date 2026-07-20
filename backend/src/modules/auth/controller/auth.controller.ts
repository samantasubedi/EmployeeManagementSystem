import { authService } from "../service/auth.service";

export const authController = {
  register: async (ctx: any) => {
    const result = await authService.register(ctx.body);
    ctx.set.status = 201;
    return { message: "user registered successfully", details: result };
    
  },
};
