import { Elysia } from "elysia";
import { authRoutes } from "./modules/auth/auth.route";
import { appError } from "./error";
import openapi from "@elysia/openapi";
import { organizationRoute } from "./modules/organization/organization.route";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(authRoutes)
  .use(organizationRoute)
  .use(openapi())
  .onError(({ error, set }) => {
    if (error instanceof appError) {
      set.status = error.status;

      return {
        message: error.message,
      };
    }

    set.status = 500;

    return {
      message: "Internal Server Error",
    };
  })
  .listen(4000);

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
