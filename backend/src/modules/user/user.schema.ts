import { t } from "elysia";

export const roleSchema = t.Union([
  t.Literal("employee"),
  t.Literal("manager"),
  t.Literal("admin"),
]);

export const organizationUserBodySchema = t.Object({
  username: t.String({ minLength: 3 }),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
  role: roleSchema,
  description: t.Optional(t.String()),
});

export const organizationUserUpdateSchema = t.Object({
  username: t.Optional(t.String({ minLength: 3 })),
  email: t.Optional(t.String({ format: "email" })),
  role: t.Optional(roleSchema),
  description: t.Optional(t.String()),
});
