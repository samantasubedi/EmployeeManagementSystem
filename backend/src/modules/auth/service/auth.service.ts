import { authRepository } from "../repository/auth.repository";
import {
  conflictError,
  notFoundError,
  unauthorizedError,
} from "../../../error";

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
  }: {
    email: string;
    username: string;
    password: string;
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
    return response;
  },
};
