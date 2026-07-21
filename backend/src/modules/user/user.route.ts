import Elysia, { t } from "elysia";

import { authGuard } from "../../middleware/auth";
import { userController } from "./user.controller";

const roleSchema = t.Union([
  t.Literal("employee"),
  t.Literal("manager"),
  t.Literal("admin"),
]);

const organizationUserBodySchema = t.Object({
  username: t.String({ minLength: 3 }),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
  role: roleSchema,
  description: t.Optional(t.String()),
});

const organizationUserUpdateSchema = t.Object({
  username: t.Optional(t.String({ minLength: 3 })),
  email: t.Optional(t.String({ format: "email" })),
  role: t.Optional(roleSchema),
  description: t.Optional(t.String()),
});

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
