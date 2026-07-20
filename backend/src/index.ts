import { Elysia } from "elysia";
import { authRoutes } from "./modules/auth/auth.route";
import { appError } from "./error";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(authRoutes).onError(({ error, set }) => {
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
