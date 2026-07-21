import { Elysia } from "elysia";

import { authRoutes } from "./modules/auth/auth.route";
import { appError } from "./error";
import openapi from "@elysia/openapi";
import { organizationRoute } from "./modules/organization/organization.route";
import { userRoute } from "./modules/user/user.route";
import { jwt } from "@elysia/jwt";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(
    jwt({ name: "accessJwt", secret: process.env.ACCESS_SECRET!, exp: "15m" }),
  )
  .use(
    jwt({
      name: "refreshJwt",
      secret: process.env.REFRESH_SECRET!,
      exp: "15d",
    }),
  )
  .use(authRoutes)
  .use(organizationRoute)
  .use(userRoute)
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
