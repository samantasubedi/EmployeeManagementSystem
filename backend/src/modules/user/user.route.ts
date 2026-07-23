import Elysia, { t } from "elysia";

import { authGuard } from "../../middleware/auth";
import { userController } from "./user.controller";
import { organizationUserBodySchema, organizationUserUpdateSchema } from "./user.schema";


export const userRoute = new Elysia({ prefix: "/organization" })
  .use(authGuard)
  .get("/users", userController.listByOrganization)
  .post("/users", userController.create, {
    body: organizationUserBodySchema,
  })
  .patch("/users/:userId", userController.edit, {
    params: t.Object({
      userId: t.String({ format: "uuid" }),
    }),
    body: organizationUserUpdateSchema,
  });

                                                                                                                                                                                                                                                                                                                                                                                                                                                                   