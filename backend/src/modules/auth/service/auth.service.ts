import { authRepository } from "../repository/auth.repository";
import { conflictError, unauthorizedError } from "../../../error";

type JwtSigner = {
  sign: (payload: Record<string, unknown>) => Promise<string>;
};

type AuthTokenSet = {
  accessToken: string;
  refreshToken: string;
};

const createAuthTokens = async (
  user: { id: string; username: string; email: string; role: string | null },
  accessJwt: JwtSigner,
  refreshJwt: JwtSigner,
): Promise<AuthTokenSet> => {
  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
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
  }: {
    username: string;
    password: string;
  }) => {
    const user = await authRepository.findUserByUsername(username);
    if (!user) {
      throw new unauthorizedError("invalid username or password");
    }
    const valid = await Bun.password.verify(password, user.hashedPassword);

    if (!valid) {
      throw new unauthorizedError("invalid username or password");
    }
    return user;
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
    const response = await authRepository.handleRegister({
      email,
      username,
      hashedPassword,
    });
    const tokens = await createAuthTokens(response, accessJwt, refreshJwt);

    return {
      user: response,
      ...tokens,
    };
  },
};
