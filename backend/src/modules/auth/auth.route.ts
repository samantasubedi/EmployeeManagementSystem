import Elysia from "elysia";
import { authController } from "./auth.controller";
import { t } from "elysia";
import { authGuard, requireAuthenticatedUser } from "../../middleware/auth";
import { loginSchema, registerSchema } from "./auth.schema";


const publicAuthRoutes = new Elysia({ prefix: "/auth" })
  .post("/register", authController.register, { body: registerSchema })
  .post("/login", authController.login, { body: loginSchema })
  .post("/logout", ({ cookie }) => {
    cookie.accessToken.set({ value: "", maxAge: 0, path: "/" });
    cookie.refreshToken.set({ value: "", maxAge: 0, path: "/" });
    return { message: "logged out successfully" };
  });
const protectedAuthRoutes = new Elysia({ prefix: "/auth" })
  .use(authGuard)
  .get("/me", async (ctx: any) => {
    const auth = await requireAuthenticatedUser(ctx);
    console.log("this is auth info", auth)
    return { user: auth };
  });

export const authRoutes = new Elysia()
  .use(publicAuthRoutes)
  .use(protectedAuthRoutes);
