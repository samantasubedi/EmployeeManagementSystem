import { t } from "elysia";

export const createOrganizationSchema = t.Object({
  name: t.String({ minLength: 2 }),
  slug: t.String({
    minLength: 3,
  }),
  description: t.Optional(t.String()),
});