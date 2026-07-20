import Elysia, { t } from "elysia";
import { organizationController } from "./controller/organization.controller";

export const createOrganizationSchema = t.Object({
  name: t.String({ minLength: 2 }),
  slug: t.String({
    minLength: 3,
  }),
  description: t.Optional(t.String()),
  ownerId: t.String({ format: "uuid" }),
});

export const organizationRoute = new Elysia({ prefix: "/organization" })
  .post("/create", organizationController.create, {
    body: createOrganizationSchema,
  })
  .patch("/", () => {});
