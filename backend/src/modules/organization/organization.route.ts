import Elysia, { t } from "elysia";
import { organizationController } from "./organization.controller";
import { authGuard } from "../../middleware/auth";
import { createOrganizationSchema } from "./organization.schema";


export const organizationRoute = new Elysia({ prefix: "/organization" })
  .use(authGuard)
  .post("/create", organizationController.create, {
    body: createOrganizationSchema,
  })
  .patch("/edit", organizationController.edit, {
    params: t.Object({
      id: t.String({ format: "uuid" }),
    }),
    body: t.Object({
      name: t.Optional(t.String({ minLength: 2 })),
      slug: t.Optional(
        t.String({
          minLength: 3,
        }),
      ),
      description: t.Optional(t.String()),
    }),
  });
