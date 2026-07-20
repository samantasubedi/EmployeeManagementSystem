import { status } from "elysia";
import { authRepository } from "../repository/auth.repository";
import { conflictError } from "../../../error";

export const authService = {
  login: ({
    email,
    username,
    password,
  }: {
    email: string;
    username: string;
    password: string;
  }) => {
    return {
      message: "this is login service",
      data: {
        message: "this is the data extracted from the user request",
        email: email,
        username: username,
      },
    };
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
    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new conflictError("Email already exists");
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
