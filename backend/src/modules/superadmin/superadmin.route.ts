import Elysia, { t } from "elysia";
import { superadminController } from "./supeadmin.controller";

const organizationSchema = t.Object({
  organizationSlug: t.String(),
});
const loginSchema = t.Object({
  username: t.String({ minlength: 3 }),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
});
const superadminRoutes = new Elysia({ prefix: "/superadmin" })
  .post("/login", superadminController.login, { body: loginSchema })
  .get("/organization", superadminController.getOrganziationInfo)
  .post("/suspend", superadminController.suspendOrganization, {
    body: organizationSchema,
  });
