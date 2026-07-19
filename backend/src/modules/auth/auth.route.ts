import Elysia from "elysia";
import { authController } from "./controller/auth.controller";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .post("/register",authController.register)
  .post("/login", () => {
    return "this is login route";
  })
  .post("/logout", () => {
    return "this is logout route";
  })
  .get("/me", () => {
    return "this returns user info";
  });
