import { forbiddenError, unauthorizedError } from "../../error";
import { authRepository } from "../auth/auth.repository";
import { createAuthTokens, JwtSigner } from "../auth/auth.service";

export const superadminService = {
  login: async ({
    username,
    password,
    accessJwt,
    refreshJwt,
  }: {
    username: string;
    email: string;
    password: string;
    accessJwt: JwtSigner;
    refreshJwt: JwtSigner;
  }) => {
    let userData = await authRepository.findUserByUsername(username);
    if (!userData) {
      throw new unauthorizedError("invalid credientials");
    }
    const valid = await Bun.password.verify(password, userData.hashedPassword);

    if (!valid) {
      throw new unauthorizedError("invalid credientials");
    }
    if(userData.role==="superadmin"){
    throw new forbiddenError()
  }
  const tokens=await createAuthTokens(userData,accessJwt,refreshJwt)
  return{
    userData:userData,
    accessToken:tokens.accessToken,
    refreshToken:tokens.refreshToken
  }
  },
  

  
};
