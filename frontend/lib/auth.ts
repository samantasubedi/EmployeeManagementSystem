import axios from "axios";

export interface AuthUser {
  userId: string;
  username: string;
  role: string | null;
  organizationId: string | null;
}

interface MeResponse {
  user: AuthUser;
}

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const { data } = await axios.get<MeResponse>(`${backendUrl}/auth/me`, {
    withCredentials: true,
  });
  return data.user;
};
