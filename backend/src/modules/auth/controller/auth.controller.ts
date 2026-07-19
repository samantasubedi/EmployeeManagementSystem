import { authService } from "../service/auth.service";

export const authController = {
  register: (ctx: any) => {
    try {
      const result = authService.register(ctx.body);
      ctx.set.status = 201;
      return{}
    } catch (err) {
      ctx.set.status=400
    }
  },
};
