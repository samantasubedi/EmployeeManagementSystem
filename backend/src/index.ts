import { Elysia } from "elysia";
import { authRoutes } from "./modules/auth/auth.route";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(authRoutes)
  .listen(4000);

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
