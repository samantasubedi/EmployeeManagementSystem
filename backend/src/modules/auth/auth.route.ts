import Elysia from "elysia";
import { authController } from "./auth.controller";
import { t } from "elysia";
import { authGuard, requireAuthenticatedUser } from "../../middleware/auth";

export const registerSchema = t.Object({
  username: t.String({ minLength: 3 }),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
});
export const loginSchema = t.Object({
  username: t.String({ minLength: 1 }),
  password: t.String({ minLength: 1 }),
});
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
