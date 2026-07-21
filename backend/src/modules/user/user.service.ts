import {
  badRequestError,
  conflictError,
  forbiddenError,
  notFoundError,
} from "../../error";
import { and, eq, ne } from "drizzle-orm";

import { db } from "../../database/client";
import { organizations, users } from "../../database/schema";

const userRepository = {
  findOrganizationById: (organizationId: string) => {
    return db.query.organizations.findFirst({
      where: eq(organizations.id, organizationId),
    });
  },
  findUserById: (userId: string) => {
    return db.query.users.findFirst({ where: eq(users.id, userId) });
  },
  findOrganizationUserById: (organizationId: string, userId: string) => {
    return db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        description: users.description,
        organizationId: users.organizationId,
      })
      .from(users)
      .where(
        and(eq(users.id, userId), eq(users.organizationId, organizationId)),
      )
      .then((rows) => rows[0]);
  },
  findOrganizationUsers: (organizationId: string) => {
    return db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        description: users.description,
        organizationId: users.organizationId,
      })
      .from(users)
      .where(eq(users.organizationId, organizationId))
      .orderBy(users.username);
  },
  findUserByEmail: (email: string) => {
    return db.query.users.findFirst({ where: eq(users.email, email) });
  },
  findUserByUsername: (username: string) => {
    return db.query.users.findFirst({ where: eq(users.username, username) });
  },
  findUserByEmailExcludingId: (email: string, userId: string) => {
    return db.query.users.findFirst({
      where: and(eq(users.email, email), ne(users.id, userId)),
    });
  },
  findUserByUsernameExcludingId: (username: string, userId: string) => {
    return db.query.users.findFirst({
      where: and(eq(users.username, username), ne(users.id, userId)),
    });
  },
  createOrganizationUser: (payload: {
    username: string;
    email: string;
    hashedPassword: string;
    role: "employee" | "manager" | "admin";
    description?: string | null;
    organizationId: string;
  }) => {
    return db
      .insert(users)
      .values(payload)
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        description: users.description,
        organizationId: users.organizationId,
      })
      .then((rows) => rows[0]);
  },
  updateOrganizationUser: (
    organizationId: string,
    userId: string,
    payload: Partial<{
      username: string;
      email: string;
      role: "employee" | "manager" | "admin";
      description: string | null;
    }>,
  ) => {
    return db
      .update(users)
      .set(payload)
      .where(
        and(eq(users.id, userId), eq(users.organizationId, organizationId)),
      )
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        description: users.description,
        organizationId: users.organizationId,
      })
      .then((rows) => rows[0]);
  },
};

type OrganizationRole = "employee" | "manager" | "admin";

const allowedRoles: OrganizationRole[] = ["employee", "manager", "admin"];

const isOrganizationRole = (
  role: string | null | undefined,
): role is OrganizationRole => {
  return (
    role !== null &&
    role !== undefined &&
    allowedRoles.includes(role as OrganizationRole)
  );
};

const getOrganization = async (organizationId: string) => {
  const organization =
    await userRepository.findOrganizationById(organizationId);
  if (!organization) {
    throw new notFoundError("organization not found");
  }
  return organization;
};

const getRequestingUser = async (userId: string) => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new notFoundError("requesting user not found");
  }
  return user;
};

const assertOrganizationAccess = async (
  organizationId: string,
  userId: string,
) => {
  const [organization, requestingUser] = await Promise.all([
    getOrganization(organizationId),
    getRequestingUser(userId),
  ]);

  const isOwner = organization.ownerId === userId;
  const isSameOrganization = requestingUser.organizationId === organizationId;

  if (!isOwner && !isSameOrganization) {
    throw new forbiddenError("you do not belong to this organization");
  }

  return { organization, requestingUser, isOwner };
};

const assertOwnerOrAdminAccess = async (
  organizationId: string,
  userId: string,
) => {
  const { organization, requestingUser, isOwner } =
    await assertOrganizationAccess(organizationId, userId);

  if (!isOwner && requestingUser.role !== "admin") {
    throw new forbiddenError(
      "only organization owner or admin can perform this action",
    );
  }

  return { organization, requestingUser, isOwner };
};

const ensureUniqueCreateFields = async (username: string, email: string) => {
  const [existingEmail, existingUsername] = await Promise.all([
    userRepository.findUserByEmail(email),
    userRepository.findUserByUsername(username),
  ]);

  if (existingEmail) {
    throw new conflictError("email already exists");
  }

  if (existingUsername) {
    throw new conflictError("username already exists");
  }
};

const ensureUniqueUpdateFields = async (
  userId: string,
  username?: string,
  email?: string,
) => {
  const [existingEmail, existingUsername] = await Promise.all([
    email ? userRepository.findUserByEmailExcludingId(email, userId) : null,
    username
      ? userRepository.findUserByUsernameExcludingId(username, userId)
      : null,
  ]);

  if (existingEmail) {
    throw new conflictError("email already exists");
  }

  if (existingUsername) {
    throw new conflictError("username already exists");
  }
};

export const userService = {
  getOrganizationUsers: async ({
    organizationId,
    requesterId,
  }: {
    organizationId: string | null;
    requesterId: string;
  }) => {
    if (!organizationId) {
      throw new forbiddenError("user is not enrolled in an organization");
    }
    await assertOwnerOrAdminAccess(organizationId, requesterId);
    return userRepository.findOrganizationUsers(organizationId);
  },
  createOrganizationUser: async ({
    organizationId,
    requesterId,
    username,
    email,
    password,
    role,
    description,
  }: {
    organizationId: string | null;
    requesterId: string;
    username: string;
    email: string;
    password: string;
    role: OrganizationRole;
    description?: string;
  }) => {
    if (!organizationId) {
      throw new forbiddenError("user is not enrolled in an organization");
    }
    await assertOwnerOrAdminAccess(organizationId, requesterId);
    await ensureUniqueCreateFields(username, email);

    if (!isOrganizationRole(role)) {
      throw new badRequestError("invalid role");
    }

    const hashedPassword = await Bun.password.hash(password);

    return userRepository.createOrganizationUser({
      username,
      email,
      hashedPassword,
      role,
      description,
      organizationId,
    });
  },
  editOrganizationUser: async ({
    organizationId,
    requesterId,
    userId,
    username,
    email,
    role,
    description,
  }: {
    organizationId: string | null;
    requesterId: string;
    userId: string;
    username?: string;
    email?: string;
    role?: OrganizationRole;
    description?: string | null;
  }) => {
    if (!organizationId) {
      throw new forbiddenError("user is not enrolled in an organization");
    }
    await assertOwnerOrAdminAccess(organizationId, requesterId);

    const targetUser = await userRepository.findOrganizationUserById(
      organizationId,
      userId,
    );
    if (!targetUser) {
      throw new notFoundError("user not found");
    }

    if (
      !username &&
      !email &&
      role === undefined &&
      description === undefined
    ) {
      throw new badRequestError("at least one field must be provided");
    }

    if (role !== undefined && !isOrganizationRole(role)) {
      throw new badRequestError("invalid role");
    }

    await ensureUniqueUpdateFields(userId, username, email);

    return userRepository.updateOrganizationUser(organizationId, userId, {
      username,
      email,
      role,
      description,
    });
  },
};
