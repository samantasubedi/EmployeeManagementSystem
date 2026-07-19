import Elysia from "elysia";
import { authController } from "./controller/auth.controller";
import { t } from "elysia";

export const registerSchema = t.Object({
  username: t.String({ minLength: 3 }),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
});
export const authRoutes = new Elysia({ prefix: "/auth" })
  .post("/register", authController.register, { body: registerSchema })
  .post("/login", () => {
    return "this is login route";
  })
  .post("/logout", () => {
    return "this is logout route";
  })
  .get("/me", () => {
    return "this returns user info";
  });
