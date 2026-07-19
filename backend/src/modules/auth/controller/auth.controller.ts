import { authService } from "../service/auth.service";

export const authController = {
  register: (ctx: any) => {
    return authService.register(ctx.body);
  },
};
