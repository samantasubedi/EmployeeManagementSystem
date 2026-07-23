import { authRepository } from "./auth.repository";
import { conflictError, unauthorizedError } from "../../error";

export type JwtSigner = {
  sign: (payload: Record<string, unknown>) => Promise<string>;
};

type AuthTokenSet = {
  accessToken: string;
  refreshToken: string;
};

export const createAuthTokens = async (
  user: {
    id: string;
    username: string;
    role: string | null;
    organizationId: string | null;
  },
  accessJwt: JwtSigner,
  refreshJwt: JwtSigner,
): Promise<AuthTokenSet> => {
  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role,
    organizationId: user.organizationId,
  };

  const [accessToken, refreshToken] = await Promise.all([
    accessJwt.sign(payload),
    refreshJwt.sign(payload),
  ]);

  return {
    accessToken,
    refreshToken,
  };
};

export const authService = {
  login: async ({
    username,
    password,
    accessJwt,
    refreshJwt,
  }: {
    username: string;
    password: string;
    accessJwt: JwtSigner;
    refreshJwt: JwtSigner;
  }) => {
    let userData = await authRepository.findUserByUsername(username);
    if (!userData) {
      throw new unauthorizedError("invalid username or password");
    }
    const valid = await Bun.password.verify(password, userData.hashedPassword);

    if (!valid) {
      throw new unauthorizedError("invalid username or password");
    }

    if (!userData.role) {
      const ownedOrganization = await authRepository.findOrganizationByOwnerId(
        userData.id,
      );

      if (ownedOrganization) {
        const updatedUser = await authRepository.updateUserRole(
          userData.id,
          "admin",
        );

        if (updatedUser) {
          userData = updatedUser;
        }
      }
    }

    const refreshedUser = await authRepository.findUserById(userData.id);
    if (refreshedUser) {
      userData = refreshedUser;
    }

    const tokens = await createAuthTokens(userData, accessJwt, refreshJwt);
    return {
      userData: userData,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  },
  register: async ({
    email,
    username,
    password,
    accessJwt,
    refreshJwt,
  }: {
    email: string;
    username: string;
    password: string;
    accessJwt: JwtSigner;
    refreshJwt: JwtSigner;
  }) => {
    const existingEmail = await authRepository.findUserByEmail(email);
    const existingUsername = await authRepository.findUserByUsername(username);
    if (existingEmail) {
      throw new conflictError("Email already exists");
    }
    if (existingUsername) {
      throw new conflictError("Username already exists");
    }
    const hashedPassword = await Bun.password.hash(password);
    const userData = await authRepository.handleRegister({
      email,
      username,
      hashedPassword,
    });
    const tokens = await createAuthTokens(userData, accessJwt, refreshJwt);

    return {
      userData: userData,
      ...tokens,
    };
  },
};
